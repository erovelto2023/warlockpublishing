import { getPenNames } from "@/lib/actions/pen-name.actions";

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    const penNames = await getPenNames();

    return (
        <div className="p-10">
            <h1>Debug Pen Names</h1>
            <pre>{JSON.stringify(penNames, null, 2)}</pre>
        </div>
    );
}
