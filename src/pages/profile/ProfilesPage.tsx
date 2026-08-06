import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil } from 'lucide-react';
import { fetchProfiles, createProfile, updateProfile, deleteProfile } from '../../services/profileService';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';
import { ProfileAvatar } from '../../components/profile/ProfileAvatar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/utils';
import type { Profile } from '../../types';

export default function ProfilesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile);
  const { success, error: toastError } = useToast();

  const [editing, setEditing] = useState<Profile | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Profile | null>(null);
  const [manageMode, setManageMode] = useState(false);
  const [name, setName] = useState('');
  const [isKids, setIsKids] = useState(false);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles', user?.id],
    queryFn: () => fetchProfiles(user!.id),
    enabled: Boolean(user),
  });

  const createMutation = useMutation({
    mutationFn: () => createProfile({ userId: user!.id, name, isKids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setCreating(false);
      setName('');
      setIsKids(false);
      success('Profile created.');
    },
    onError: (err) => toastError(friendlyError(err)),
  });

  const updateMutation = useMutation({
    mutationFn: () => updateProfile(editing!.id, { name, is_kids: isKids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setEditing(null);
      setName('');
      setIsKids(false);
      success('Profile updated.');
    },
    onError: (err) => toastError(friendlyError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProfile(deleting!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setDeleting(null);
      success('Profile deleted.');
    },
    onError: (err) => toastError(friendlyError(err)),
  });

  const selectProfile = (profile: Profile) => {
    setActiveProfile(profile);
    navigate('/home');
  };

  const openCreate = () => {
    setName('');
    setIsKids(false);
    setCreating(true);
  };

  const openEdit = (profile: Profile) => {
    setEditing(profile);
    setName(profile.name);
    setIsKids(profile.is_kids);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Who's watching?</h1>

      {isLoading ? (
        <div className="mt-10 flex gap-6">
          <Skeleton className="h-28 w-28 rounded-xl sm:h-32 sm:w-32" />
          <Skeleton className="h-28 w-28 rounded-xl sm:h-32 sm:w-32" />
        </div>
      ) : (
        <div className="mt-10 flex flex-wrap items-start justify-center gap-6">
          {(profiles || []).map((profile) => (
            <motion.button
              key={profile.id}
              type="button"
              whileHover={{ scale: 1.05 }}
              onClick={() => (manageMode ? openEdit(profile) : selectProfile(profile))}
              className="group flex flex-col items-center gap-3 focus-visible:outline-none"
            >
              <div className="relative">
                <ProfileAvatar profile={profile} size="lg" />
                {manageMode && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">
                    <Pencil className="h-8 w-8 text-white" />
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">
                {profile.name}
                {profile.is_kids && <span className="ml-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">Kids</span>}
              </span>
            </motion.button>
          ))}

          {(profiles || []).length < 5 && (
            <button
              type="button"
              onClick={openCreate}
              className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-borderc px-6 py-8 text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-12 w-12" />
              <span className="text-sm font-medium">Add Profile</span>
            </button>
          )}
        </div>
      )}

      <div className="mt-10 flex gap-3">
        <Button variant="outline" onClick={() => setManageMode((v) => !v)}>
          {manageMode ? 'Done' : 'Manage Profiles'}
        </Button>
        <Button variant="ghost" onClick={() => navigate('/account')}>Account</Button>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={creating || editing !== null}
        onClose={() => { setCreating(false); setEditing(null); }}
        title={editing ? 'Edit profile' : 'Add profile'}
      >
        <div className="space-y-4">
          <Input label="Profile name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Areeba" />
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" checked={isKids} onChange={(e) => setIsKids(e.target.checked)} className="h-4 w-4 accent-[var(--sf-primary)]" />
            Kids profile (age-appropriate content only)
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</Button>
            <Button
              onClick={() => (editing ? updateMutation.mutate() : createMutation.mutate())}
              loading={createMutation.isPending || updateMutation.isPending}
              disabled={name.trim().length === 0}
            >
              {editing ? 'Save changes' : 'Create profile'}
            </Button>
          </div>
          {editing && (
            <div className="border-t border-borderc pt-4">
              <Button variant="danger" onClick={() => { setDeleting(editing); setEditing(null); }}>
                Delete this profile
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete profile?"
        message={'This will permanently remove "' + (deleting ? deleting.name : '') + '" and all of its viewing data.'}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
