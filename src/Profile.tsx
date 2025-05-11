import { NavigationBar } from "./components/NavigationBar";
import { Button } from "./components/ui/button";
import { useApp } from "./contexts/AppContext";
import { useState } from "react";

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
    const { userData } = useApp();

    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState(userData?.username);
    const [editedEmail, setEditedEmail] = useState(userData?.email);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUsername(e.target.value);  
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedEmail(e.target.value);
    };

    const handleSave = () => {
        setIsEditing(false);
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
                    <button
                        onClick={handleSave}
                        className="bg-primary text-white px-4 py-2 rounded-md"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                    <p className="font-mono text-base">Name: {userData?.username}</p>
                    <p className="font-mono text-base">Email: {userData?.email}</p>
                    <Button
                        variant="outline"
                        className="w-fit"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </Button>
                    <Button
                        className="bg-primary text-white w-fit"
                        onClick={() => setIsEditing(true)}
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