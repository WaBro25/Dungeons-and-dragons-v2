import { useEffect, useState } from "react";
import Image from "next/image";

interface CarouselItem {
	name: string;
	image: string;
}

interface MonsterCarouselProps {
	visible: boolean;
	names?: string[];
}

export default function MonsterCarousel({ visible, names = ["Adult Brass Dragon", "Adult Red Dragon", "Adult Black Dragon"] }: MonsterCarouselProps) {
	// Use static image URLs for reliability
	const staticMap: Record<string, string> = {
		"Adult Brass Dragon": "https://www.dnd5eapi.co/api/images/monsters/adult-brass-dragon.png",
		"Adult Red Dragon": "https://www.dnd5eapi.co/api/images/monsters/adult-red-dragon.png",
		"Adult Black Dragon": "https://www.dnd5eapi.co/api/images/monsters/adult-black-dragon.png",
	};
	const initial: CarouselItem[] = names.map((n) => ({
		name: n,
		image: staticMap[n] ?? "/vercel.svg",
	}));
	const [items, setItems] = useState<CarouselItem[]>(initial);
	const [index, setIndex] = useState(0);

	// Rebuild static items if the provided names prop changes
	useEffect(() => {
		const next = names.map((n) => ({
			name: n,
			image: staticMap[n] ?? "/vercel.svg",
		}));
		setItems(next);
		setIndex(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [names.join("|")]);

	useEffect(() => {
		if (!visible || items.length === 0) return;
		const id = setInterval(() => {
			setIndex((i) => (i + 1) % items.length);
		}, 3000);
		return () => clearInterval(id);
	}, [visible, items]);

	if (!visible || items.length === 0) return null;

	return (
		<div className="my-4 flex items-center gap-4">
			<button
				type="button"
				className="px-3 py-2 rounded bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
				onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
				aria-label="Previous"
			>
				‹
			</button>
			<div className="text-center">
				<div className="relative w-[400px] h-[400px]">
					<Image
						src={items[index].image}
						alt={items[index].name}
						fill
						sizes="400px"
						className="object-contain rounded"
						unoptimized
						onError={() => {
							setItems((prev) => {
								const next = prev.slice();
								const current = next[index];
								let fallback = "/vercel.svg";
								// 1) Try switching host www -> non-www
								if (current.image.includes("https://www.dnd5eapi.co/")) {
									fallback = current.image.replace("https://www.dnd5eapi.co/", "https://dnd5eapi.co/");
								}
								// 2) If still PNG, try WEBP variant
								else if (current.image.endsWith(".png")) {
									fallback = current.image.replace(".png", ".webp");
								}
								next[index] = { ...current, image: fallback };
								return next;
							});
						}}
					/>
				</div>
				<div className="mt-2 text-lg font-medium">{items[index].name}</div>
			</div>
			<button
				type="button"
				className="px-3 py-2 rounded bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
				onClick={() => setIndex((i) => (i + 1) % items.length)}
				aria-label="Next"
			>
				›
			</button>
		</div>
	);
}


