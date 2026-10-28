"use client";

import { useRef, useState } from "react";
import type { Guest } from "../domain/guest";
import { guestAssignments, type Host } from "../domain/assignments";
import { newGuest } from "../domain/new-guest";
import { filterGuests, guestSummary, type GuestFilter } from "../domain/guest-list";
import { copyInvitation, invitationLink, submitAssignments, submitGuest, submitVideo } from "../infra/browser";
import { filterGuestVideos, type VideoFilter } from "../domain/guest-videos";

export function useGuestManagement(guests: Guest[], onSaved: () => void) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("guests");
  const [videoFilter, setVideoFilter] = useState<VideoFilter>("all");
  const [savedVideos, setSavedVideos] = useState<Record<string, boolean>>({});
  const [videoPending, setVideoPending] = useState(false);
  const [videoError, setVideoError] = useState("");
  const savingVideo = useRef(false);
  const currentGuests = guests.map(guest => guest._id in savedVideos ? { ...guest, video: savedVideos[guest._id] } : guest);
  const videoCount = currentGuests.filter(guest => guest.video).length;
  async function toggleVideo(guest: Guest) {
    if (savingVideo.current) return;
    savingVideo.current = true;
    setVideoPending(true);
    setVideoError("");
    try {
      await submitVideo(guest._id, !guest.video);
      setSavedVideos(current => ({ ...current, [guest._id]: !guest.video }));
    } catch {
      setVideoError("Video-Status konnte nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      savingVideo.current = false;
      setVideoPending(false);
    }
  }
  const [filter, setFilter] = useState<GuestFilter>("all");
  const [group, setGroup] = useState("");
  const [host, setHost] = useState("");
  const [editor, setEditor] = useState<Guest | "new" | null>(null);
  const [name, setName] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [groupName, setGroupName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [link, setLink] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const saving = useRef(false);
  const availableGroups = [...new Set([...guests.flatMap(g => g.groups), ...groups])].sort((a, b) => a.localeCompare(b, "de"));
  function open(guest: Guest | "new") {
    setEditor(guest);
    setName(guest === "new" ? "" : guest.name);
    setGroups(guest === "new" ? [] : [...guest.groups]);
    setHosts(guest === "new" ? [] : [...guest.hosts]);
    setGroupName(""); setError(""); setCopyMessage("");
    setLink(guest === "new" ? "" : invitationLink(guest._id));
  }
  function close() { if (!saving.current) setEditor(null); }
  function addGroup() {
    const value = groupName.trim();
    if (!value || value.length > 40 || groups.length >= 50) return;
    setGroups(current => [...new Set([...current, value])]);
    setGroupName("");
  }
  async function copy() {
    if (!editor || editor === "new") return;
    try { await copyInvitation(editor._id); setCopyMessage("Einladungslink kopiert."); }
    catch { setCopyMessage("Kopieren nicht möglich. Bitte den Link unten markieren."); }
  }
  async function submit() {
    if (saving.current || !editor) return;
    const assignments = guestAssignments({ groups, hosts });
    const created = newGuest({ name, groups, hosts });
    if (!assignments || (editor === "new" && !created)) {
      setError("Bitte gib einen Namen mit 1 bis 100 Zeichen ein und prüfe Gruppen und Hosts.");
      return;
    }
    saving.current = true; setPending(true); setError(""); setNotice("");
    try {
      if (editor === "new") await submitGuest(created!);
      else await submitAssignments(editor._id, assignments);
      if (editor === "new") { setSearch(""); setFilter("all"); setVideoFilter("all"); setGroup(""); setHost(""); }
      setNotice(editor === "new" ? "Gast hinzugefügt." : "");
      setEditor(null);
      onSaved();
    } catch {
      setError(editor === "new" ? "Gast konnte nicht hinzugefügt werden. Bitte versuche es erneut." : "Zuordnung konnte nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      saving.current = false; setPending(false);
    }
  }
  return {
    guests: view === "videos" ? filterGuestVideos(currentGuests, search, videoFilter) : filterGuests(currentGuests, search, filter, group, host),
    summary: guestSummary(guests),
    view, setView, videoFilter, setVideoFilter, videoCount, videoPending, videoError, toggleVideo,
    search, setSearch, filter, setFilter, group, setGroup, host, setHost,
    editor, open, close, name, setName, groups, setGroups, hosts, setHosts,
    groupName, setGroupName, availableGroups, addGroup, pending, error, notice,
    link, copyMessage, copy, submit,
  };
}
