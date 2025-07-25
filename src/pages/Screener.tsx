import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SuggestedCard from "@/components/ui/SuggestedCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Pencil, Plus, Trash } from "lucide-react";

const screener = [
    {
        id: 1,
        name: "Screener 1",
        description: "Screener 1 description",
        filters: [
            {
                id: 1,
                name: "Filter 1",
                description: "Filter 1 description"
            },
            {
                id: 2,
                name: "Filter 2",
                description: "Filter 2 description"
            }
        ]
    },
    {
        id: 2,
        name: "Screener 2",
        description: "Screener 2 description",
        filters: [
            {
                id: 1,
                name: "Filter 1",
                description: "Filter 1 description"
            }
        ]
    }
]

const suggestedScreener = [{
        title: "Suggested Screener",
        description: "This is a description",
        content: "Capture trending stocks",
        onAddButton: { onClick: () => {}, title: "Add to Screener" },
        onViewButton: { onClick: () => {}, title: "View Screener" }
    },
    {
        title: "Suggested Screener 2",
        description: "This is a description",
        content: "Capture trending stocks",
        onAddButton: { onClick: () => {}, title: "Add to Screener" },
        onViewButton: { onClick: () => {}, title: "View Screener" }
    }
]

export default function Screener() {
    return (
        <div>
            <NavigationBar />
            <div className="grid grid-cols-2 gap-4">
                <div className="container pl-10 mt-10">
                    <div className="flex flex-row justify-between items-center">
                        <div className="font-stretch-extra-condensed uppercase text-gray-500 text-3xl my-4">
                            Saved Screeners
                        </div>
                        <Button variant="outline" className="shadow-md">
                            <Plus />
                        </Button>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-gray-500 font-semibold">Name</TableHead>
                                    <TableHead className="text-gray-500 font-semibold">Description</TableHead>
                                    <TableHead className="text-gray-500 font-semibold">Filters</TableHead>
                                    <TableHead className="text-gray-500 font-semibold"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {screener.map((screener) => (
                                    <TableRow key={screener.id}>
                                        <TableCell>{screener.name}</TableCell>
                                        <TableCell>{screener.description}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-row gap-2">
                                                {screener.filters.map((filter) => (
                                                    <div key={filter.id}>{filter.name}</div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex flex-row gap-2">
                                            <Button variant="outline">
                                                <Pencil />
                                            </Button>
                                            <Button variant="outline">
                                                <Trash />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="container pr-10 mt-10">
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex flex-row justify-between items-center">
                            {suggestedScreener.slice(0, 3).map((screener) => (
                                <SuggestedCard
                                    className="w-60 h-fit"
                                    title={screener.title}
                                    description={screener.description}
                                    content={screener.content}
                                    onAddButton={{ onClick: () => {}, title: "Add to Screener" }}
                                    onViewButton={{ onClick: () => {}, title: "View Screener" }}
                                />
                            ))}
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            {suggestedScreener.slice(0, 3).map((screener) => (
                                <SuggestedCard
                                    className="w-60 h-fit"
                                    title={screener.title}
                                    description={screener.description}
                                    content={screener.content}
                                    onAddButton={{ onClick: () => {}, title: "Add to Screener" }}
                                    onViewButton={{ onClick: () => {}, title: "View Screener" }}
                                />
                            ))}
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            {suggestedScreener.slice(0, 3).map((screener) => (
                                <SuggestedCard
                                    className="w-60 h-fit"
                                    title={screener.title}
                                    description={screener.description}
                                    content={screener.content}
                                    onAddButton={{ onClick: () => {}, title: "Add to Screener" }}
                                    onViewButton={{ onClick: () => {}, title: "View Screener" }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center">
                        <a href="/suggested-screeners" className="text-gray-500 text-m underline">Find More Screeners</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
