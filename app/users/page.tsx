import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
	const notes = await prisma.note.findMany({
		select: { id: true, text: true },
		orderBy: { id: "desc" },
	});

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
			<h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
				Notes
			</h1>
			<ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
				{notes.map((n) => <li key={n.id} className="mb-2">{n.text ?? "(empty)"}</li>)}
			</ol>
			<Link
				href="/"
				className="mt-6 px-4 py-2 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 text-sm"
			>
				Back
			</Link>
		</div>
	);
}


