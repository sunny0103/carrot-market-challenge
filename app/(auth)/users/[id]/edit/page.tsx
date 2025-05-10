"use client";

import Input from "@/components/input";
import { use, useActionState, useEffect, useState } from "react";
import { editProfile, getUserProfile } from "./actions";
import { SVG_PATHS } from "@/components/svg-path";
import Link from "next/link";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  password: string;
}

export default function Edit({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [state, dispatch] = useActionState(editProfile, null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPassword, setChangePassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getUserProfile(resolvedParams.id);
      setProfile({
        username: data?.username || "",
        email: data?.email || "",
        bio: data?.bio || "",
        password: data?.password || "",
      });
    };
    loadProfile();
  }, [resolvedParams.id]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-neutral-800 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Edit Your Profile</h2>
        </div>

        <form action={dispatch} className="space-y-4">
          <div className="space-y-4">
            <Input
              name="username"
              type="text"
              placeholder="Username"
              required
              defaultValue={profile?.username}
              errors={state?.fieldErrors?.username}
              svgPath={SVG_PATHS.USER}
              svgClassname="size-6 absolute top-4 left-3 text-gray-400"
            />
            <Input
              name="bio"
              type="text"
              placeholder="Bio"
              defaultValue={profile?.bio}
              errors={state?.fieldErrors?.username}
              svgPath={SVG_PATHS.USER}
              svgClassname="size-6 absolute top-4 left-3 text-gray-400"
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              defaultValue={profile?.email}
              errors={state?.fieldErrors?.email}
              svgPath={SVG_PATHS.EMAIL}
              svgClassname="size-6 absolute top-4 left-3 text-gray-400"
            />
            <button
              type="button"
              onClick={() => setChangePassword(!showPassword)}
              className="w-full bg-blue-800 py-2 rounded-md hover:bg-blue-500 transition-colors ease-in-out"
            >
              {showPassword ? "Cancel Password Change" : "Change Password"}
            </button>
            {showPassword && (
              <>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  errors={state?.fieldErrors.password}
                  minLength={PASSWORD_MIN_LENGTH}
                  svgPath={SVG_PATHS.PASSWORD}
                  svgClassname="size-6 absolute top-4 left-3 text-gray-400"
                />
                <Input
                  name="confirm_password"
                  type="password"
                  placeholder="Confirm Password"
                  required
                  errors={state?.fieldErrors.confirm_password}
                  minLength={PASSWORD_MIN_LENGTH}
                  svgPath={SVG_PATHS.PASSWORD}
                  svgClassname="size-6 absolute top-4 left-3 text-gray-400"
                />
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/users/${profile?.username}`}
              className="w-full rounded-lg bg-neutral-700 px-4 py-2 text-center hover:bg-neutral-600"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 px-4 py-2 hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
