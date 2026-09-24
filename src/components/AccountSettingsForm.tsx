"use client";

import { useEffect, useState } from "react";

type Account = { id: string; username: string; role: string };
type UserDraft = { username: string; password: string; role: string };
const emptyDraft: UserDraft = { username: "", password: "", role: "editor" };

export function AccountSettingsForm({ initialAccount }: { initialAccount: Account }) {
  const [account, setAccount] = useState(initialAccount);
  const [users, setUsers] = useState<Account[]>([]);
  const [draft, setDraft] = useState<UserDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadUsers() {
    const response = await fetch("/api/admin/users");
    if (response.ok) setUsers(((await response.json()) as { users: Account[] }).users);
  }

  useEffect(() => {
    if (initialAccount.role === "admin") void loadUsers();
  }, [initialAccount.role]);

  async function saveCurrentAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...account, password: draft.password }),
    });
    const data = (await response.json().catch(() => ({}))) as { account?: Account; message?: string };
    setSaving(false);
    setMessage(data.message ?? "Gagal memperbarui akun.");
    if (response.ok && data.account) {
      setAccount(data.account);
      setDraft(emptyDraft);
      await loadUsers();
    }
  }

  async function saveUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch(editingId ? `/api/admin/users/${editingId}` : "/api/admin/users", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setSaving(false);
    setMessage(data.message ?? "Gagal menyimpan pengguna.");
    if (response.ok) {
      setDraft(emptyDraft);
      setEditingId(null);
      await loadUsers();
    }
  }

  async function deleteUser(id: string) {
    if (!window.confirm("Hapus pengguna ini?")) return;
    const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setMessage(data.message ?? "Gagal menghapus pengguna.");
    if (response.ok) await loadUsers();
  }

  return (
    <div className="mt-6 space-y-6">
      {account.role === "admin" ? (
        <form onSubmit={saveCurrentAccount} className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">Akun saya</h2>
          <p className="mt-1 text-sm text-slate-500">Ubah data akun yang sedang digunakan dan reset password.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <input required value={account.username} onChange={(event) => setAccount({ ...account, username: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Username" />
            <input type="password" minLength={6} value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Password baru" />
            <select value={account.role} onChange={(event) => setAccount({ ...account, role: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="admin">Admin</option><option value="editor">Editor</option>
            </select>
          </div>
          <button type="submit" disabled={saving} className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:bg-slate-400">Simpan akun saya</button>
        </form>
      ) : null}

      {account.role === "admin" ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">Pengguna admin</h2>
          <p className="mt-1 text-sm text-slate-500">Tambah pengguna, reset password, ubah role, atau hapus akun.</p>
          <form onSubmit={saveUser} className="mt-5 grid gap-3 md:grid-cols-4">
            <input required value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value })} placeholder="Username" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <input required={!editingId} minLength={6} type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} placeholder={editingId ? "Password baru (opsional)" : "Password"} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="admin">Admin</option><option value="editor">Editor</option></select>
            <button type="submit" disabled={saving} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">{editingId ? "Simpan perubahan" : "Tambah pengguna"}</button>
          </form>
          {editingId ? <button type="button" onClick={() => { setEditingId(null); setDraft(emptyDraft); }} className="mt-3 text-sm text-slate-500">Batal edit</button> : null}
          {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
          <div className="mt-5 divide-y divide-slate-100 border-t border-slate-100">
            {users.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div><p className="font-medium text-slate-900">{user.username}</p><p className="text-xs text-slate-500">Role: {user.role}</p></div>
                <div className="flex gap-3"><button type="button" onClick={() => { setEditingId(user.id); setDraft({ username: user.username, password: "", role: user.role }); }} className="text-sm font-semibold text-amber-700">Edit / Reset password</button><button type="button" onClick={() => deleteUser(user.id)} className="text-sm font-semibold text-red-600">Hapus</button></div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {message && account.role !== "admin" ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
