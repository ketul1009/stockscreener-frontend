import { NavigationBar } from "../components/NavigationBar";
import { Button } from "../components/ui/button";
import { useApp } from "../contexts/AppContext";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("Account");

    const tabs = ["Account", "Settings"];

    const renderContent = () => {
        switch (activeTab) {
            case "Account":
                return (
                    <div className="space-y-4">
                        <Account />
                    </div>
                );
            case "Settings":
                return (
                    <div className="space-y-4">
                        <Settings />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <NavigationBar />
            <div className="flex flex-row items-start h-screen p-6">
                <div className="flex flex-col items-start w-48 space-y-2 h-screen pr-8 border-r border-gray-200">
                    {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            activeTab === tab
                                ? "bg-primary text-white"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="flex flex-col items-start ml-8 w-full">
                {renderContent()}
                </div>
            </div>
        </div>
    );
}

const Account = () => {
    const { userData, getUserData } = useApp();
    const { login } = useAuth();
    const context = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [editedUsername, setEditedUsername] = useState(userData?.username);
    const [editedEmail, setEditedEmail] = useState(userData?.email);

    useEffect(() => {
        setEditedUsername(userData?.username);
        setEditedEmail(userData?.email);
    }, [userData]);
    
    useEffect(() => {
        getUserData();
    }, [isEdited]);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUsername(e.target.value);  
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedEmail(e.target.value);
    };

    const handleSave = async () => {
        await axiosInstance.put(`/update-user`, {
            id: userData?.id,
            username: editedUsername,
            email: editedEmail
        }).then((res) => {
            if (res.status === 200) {
                const data = res.data
                login({ id: data.user.id, email: data.user.email, username: data.user.username }, data.token)
                setIsEditing(false);
                setIsEdited(true);
                context.showToast("Profile updated successfully", "success");
            } else if (res.status === 409) {
                context.showToast("Username or email already in use", "error");
            }
        }).catch((err) => {
            context.showToast("Failed to update profile", "error");
        });
    };
    
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase">Personal Information</h2>
            {isEditing ? (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={editedUsername}
                        onChange={handleUsernameChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <input
                        type="email"
                        value={editedEmail}
                        onChange={handleEmailChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <Button
                        onClick={handleSave}
                        disabled={editedUsername === userData?.username && editedEmail === userData?.email}
                    >
                        Save
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    <p className="font-mono text-base">Name: {userData?.username}</p>
                    <p className="font-mono text-base">Email: {userData?.email}</p>
                    <Button
                        variant="outline"
                        className="w-fit"
                        onClick={() => {
                            setIsEditing(true);
                            setIsEdited(false);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        className="bg-primary text-white w-fit"
                        onClick={() => {
                            setIsEditing(true);
                            setIsEdited(false);
                        }}
                    >
                        Forgot Password
                    </Button>
                </div>
            )}
        </div>
    );
}

const Settings = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Settings</h2>
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notifications" className="rounded" />
                    <label htmlFor="notifications">Enable Notifications</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="darkMode" className="rounded" />
                    <label htmlFor="darkMode">Dark Mode</label>
                </div>
            </div>
        </div>
    );
}