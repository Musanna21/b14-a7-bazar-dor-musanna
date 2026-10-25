
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleUserRound, LoaderCircle, Save } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "../../lib/auth-client";

export default function ProfileForm({ user }) {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  const [name, setName] = useState(user.name ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (trimmedName.length < 2) {
      toast.error("Your name must contain at least 2 characters.");
      return;
    }

    if (trimmedName.length > 80) {
      toast.error("Your name cannot exceed 80 characters.");
      return;
    }

    if (trimmedImage) {
      try {
        const parsed = new URL(trimmedImage);

        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("Unsupported image URL");
        }
      } catch {
        toast.error("Enter a valid HTTP or HTTPS image URL.");
        return;
      }
    }

    const updates = {
      name: trimmedName,
    };

    // An empty image field leaves the existing image unchanged.
    if (trimmedImage) {
      updates.image = trimmedImage;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser(updates);

      if (result.error) {
        toast.error(
          result.error.message || "Unable to update your profile."
        );
        return;
      }

      await refetch();

      toast.success("Your profile has been updated.");
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Something went wrong while updating your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--bazar-border)] bg-white shadow-sm">
      <div className="bg-gradient-to-br from-green-50 to-amber-50 px-6 py-7 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white text-green-800 shadow-sm">
            {image.trim() ? (
              <img
                src={image.trim()}
                alt="Profile preview"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                className="h-full w-full object-cover"
              />
            ) : (
              <CircleUserRound size={34} />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-green-700">
              Account settings
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
              Your Profile
            </h1>

            <p className="mt-1 break-all text-sm text-gray-600">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
        <div>
          <label
            htmlFor="profile-name"
            className="mb-2 block text-sm font-bold text-gray-800"
          >
            Full name
          </label>

          <input
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />

          <p className="mt-2 text-xs text-gray-500">
            This name is shown when you sign in.
          </p>
        </div>

        <div>
          <label
            htmlFor="profile-email"
            className="mb-2 block text-sm font-bold text-gray-800"
          >
            Email address
          </label>

          <input
            id="profile-email"
            type="email"
            value={user.email ?? ""}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
          />

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Email is read-only here. Changing it requires a separate
            email-change and verification flow.
          </p>
        </div>

        <div>
          <label
            htmlFor="profile-image"
            className="mb-2 block text-sm font-bold text-gray-800"
          >
            Profile image URL
            <span className="ml-2 font-normal text-gray-400">
              Optional
            </span>
          </label>

          <input
            id="profile-image"
            name="image"
            type="url"
            autoComplete="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Paste an image URL to update your profile picture. Leave it
            blank to keep the current picture.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              setName(user.name ?? "");
              setImage(user.image ?? "");
            }}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Reset Changes
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="flex items-start gap-3 border-t border-green-100 bg-green-50/70 px-6 py-4 sm:px-8">
        <CheckCircle2
          size={17}
          className="mt-0.5 shrink-0 text-green-800"
        />

        <p className="text-xs leading-5 text-gray-600">
          Your profile is managed by Bazar Dor's authentication service.
          Changes are saved to your account, not just to this browser.
        </p>
      </div>
    </div>
  );
}
