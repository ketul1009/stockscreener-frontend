import { Button } from "@/components/ui/button";
import { NavigationBar } from "@/components/NavigationBar";
export default function Dashboard() {
    return (
        <div>
            <NavigationBar />
            <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
                <div className="flex flex-row">
                    <div className="m-8">
                        <Button className="rounded-full w-36 h-36 flex flex-col items-center justify-center gap-2">
                            <span className="text-sm font-semibold">Saved</span>
                            <span className="text-sm font-semibold">Screeners</span>
                        </Button>
                    </div>
                    <div className="w-12 h-12"></div>
                    <div className="m-8">
                        <Button className="rounded-full w-36 h-36 flex flex-col items-center justify-center gap-2">
                            <span className="text-sm font-semibold">Create</span>
                            <span className="text-sm font-semibold">New Screener</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
