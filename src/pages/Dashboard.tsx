import { Button } from "@/components/ui/button";
import { NavigationBar } from "@/components/NavigationBar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

    const navigate = useNavigate();

    return (
        <div>
            <NavigationBar />
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="flex flex-row">
                    <div className="m-8">
                        <Button className="rounded-full w-36 h-36 flex flex-col items-center justify-center gap-2"
                            onClick={() => navigate("/screener")}
                        >
                            <span className="text-sm font-semibold">Saved</span>
                            <span className="text-sm font-semibold">Screeners</span>
                        </Button>
                    </div>
                    <div className="w-12 h-12"></div>
                    <div className="m-8">
                        <Button className="rounded-full w-36 h-36 flex flex-col items-center justify-center gap-2"
                            onClick={() => navigate("/create-screener")}
                        >
                            <span className="text-sm font-semibold">Create</span>
                            <span className="text-sm font-semibold">New Screener</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
