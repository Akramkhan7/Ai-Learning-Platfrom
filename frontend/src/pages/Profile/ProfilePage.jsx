import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();

        setUsername(response.data.username || "");
        setEmail(response.data.email || "");
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      await authService.changePassword(
        currentPassword,
        newPassword,
      );

      toast.success("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <PageHeader title="Profile Settings" />

      <div className="space-y-8">

        {/* User Information */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            User Information
          </h3>

          <div className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Username
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-neutral-400" />
                </div>

                <p className="w-full h-10 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-800">
                  {username}
                </p>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Email Address
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-neutral-400" />
                </div>

                <p className="w-full h-10 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-800">
                  {email}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Change Password
          </h3>

          <form
            onSubmit={handlePasswordUpdate}
            className="space-y-4"
          >

            {/* Current Password */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Current Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-neutral-400" />
                </div>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                 className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-500 transition-colors duration-200  focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                New Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-neutral-400" />
                </div>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                 className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-500 transition-colors duration-200  focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Confirm New Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-neutral-400" />
                </div>

                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) =>
                    setConfirmNewPassword(e.target.value)
                  }
                  className="w-full h-9 pl-9 pr-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-500 transition-colors duration-200  focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <Spinner />
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;