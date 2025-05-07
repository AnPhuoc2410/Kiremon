import { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";

import { Header, Navbar, Loading } from "../../../components/ui";
import * as S from "./index.style";

const pokemonGenerations = [
	{
		id: 1,
		name: "Generation I",
		games: ["Red", "Blue", "Green", "Yellow"],
		region: "Kanto",
		releaseYear: 1996,
		starterImageUrl:
			"https://archives.bulbagarden.net/media/upload/7/79/Kanto_Trio_Pok%C3%A9dex_skin_m.png", // Bulbasaur, Charmander, Squirtle
		pokemonCount: 151,
		apiId: "generation-i",
	},
	{
		id: 2,
		name: "Generation II",
		games: ["Gold", "Silver", "Crystal"],
		region: "Johto",
		releaseYear: 1999,
		starterImageUrl:
			"https://archives.bulbagarden.net/media/upload/thumb/a/a2/Johto_first_partners_anime.png/241px-Johto_first_partners_anime.png", // Chikorita, Cyndaquil, Totodile
		pokemonCount: 100,
		apiId: "generation-ii",
	},
	{
		id: 3,
		name: "Generation III",
		games: ["Ruby", "Sapphire", "Emerald", "FireRed", "LeafGreen"],
		region: "Hoenn",
		releaseYear: 2002,
		starterImageUrl:
			"https://archives.bulbagarden.net/media/upload/thumb/8/86/Hoenn_first_partners_anime.png/241px-Hoenn_first_partners_anime.png", // Treecko, Torchic, Mudkip
		pokemonCount: 135,
		apiId: "generation-iii",
	},
	{
		id: 4,
		name: "Generation IV",
		games: ["Diamond", "Pearl", "Platinum", "HeartGold", "SoulSilver"],
		region: "Sinnoh",
		releaseYear: 2006,
		starterImageUrl:
			"https://archives.bulbagarden.net/media/upload/thumb/2/27/Sinnoh_first_partners_anime.png/300px-Sinnoh_first_partners_anime.png", // Turtwig, Chimchar, Piplup
		pokemonCount: 107,
		apiId: "generation-iv",
	},
	{
		id: 5,
		name: "Generation V",
		games: ["Black", "White", "Black 2", "White 2"],
		region: "Unova",
		releaseYear: 2010,
		starterImageUrl:
			"https://archives.bulbagarden.net/media/upload/thumb/7/73/Unova_first_partners_anime.png/300px-Unova_first_partners_anime.png", // Snivy, Tepig, Oshawott
		pokemonCount: 156,
		apiId: "generation-v",
	},
	{
		id: 6,
		name: "Generation VI",
		games: ["X", "Y", "Omega Ruby", "Alpha Sapphire"],
		region: "Kalos",
		releaseYear: 2013,
		starterImageUrl:
			"https://archives.bulbagarden.net/media/upload/thumb/b/b6/Kalos_first_partners_anime.png/300px-Kalos_first_partners_anime.png", // Chespin, Fennekin, Froakie
		pokemonCount: 72,
		apiId: "generation-vi",
	},
	{
		id: 7,
		name: "Generation VII",
		games: ["Sun", "Moon", "Ultra Sun", "Ultra Moon", "Let's Go"],
		region: "Alola",
		releaseYear: 2016,
		starterImageUrl:
			"https://archives.bulbagarden.net/media/upload/thumb/6/62/Alola_first_partners_anime.png/300px-Alola_first_partners_anime.png", // Rowlet, Litten, Popplio
		pokemonCount: 88,
		apiId: "generation-vii",
	},
	{
		id: 8,
		name: "Generation VIII",
		games: [
			"Sword",
			"Shield",
			"Brilliant Diamond",
			"Shining Pearl",
			"Legends: Arceus",
		],
		region: "Galar",
		releaseYear: 2019,
		starterImageUrl:
			"https://pm1.aminoapps.com/7120/feb252f9f727aa39c7ac120579f269fb74c1f6cdr1-993-805v2_hq.jpg", // Grookey, Scorbunny, Sobble
		pokemonCount: 89,
		apiId: "generation-viii",
	},
	{
		id: 9,
		name: "Generation IX",
		games: ["Scarlet", "Violet", "The Teal Mask", "The Indigo Disk"],
		region: "Paldea",
		releaseYear: 2022,
		starterImageUrl:
			"https://archives.bulbagarden.net/media/upload/thumb/c/c9/Paldea_first_partners_anime.png/375px-Paldea_first_partners_anime.png", // Sprigatito, Fuecoco, Quaxly
		pokemonCount: 103,
		apiId: "generation-ix",
	},
];

const GenerationsExplore = () => {
	const navigate = useNavigate();
	const navRef = createRef<HTMLDivElement>();
	const [navHeight, setNavHeight] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setNavHeight(navRef.current?.clientHeight as number);
		// Simulate loading data from an API
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [navRef]);

	const handleGenerationClick = (genId: string) => {
		// Navigate to the generation detail page
		navigate(`/explore/generations/${genId}`);
	};

	return (
		<>
			<S.GenerationsContainer style={{ marginBottom: navHeight }}>
				<Header
					title="Explore by Generation"
					subtitle="Discover Pokémon across different game releases"
				/>

				<S.BackButton onClick={() => navigate("/pokemons")}>
					← Back to Explore
				</S.BackButton>

				{isLoading ? (
					<S.LoadingWrapper>
						<Loading label="Loading generations data..." />
					</S.LoadingWrapper>
				) : (
					<S.GenerationsGrid>
						{pokemonGenerations.map((generation) => (
							<S.GenerationCard
								key={generation.id}
								onClick={() => handleGenerationClick(generation.apiId)}
							>
								<S.GenerationBanner imageUrl={generation.starterImageUrl}>
									<S.GenerationTitle>{generation.name}</S.GenerationTitle>
								</S.GenerationBanner>

								<S.GenerationInfo>
									<div>
										<strong>Games:</strong> {generation.games.join(", ")}
									</div>
									<S.GenerationDetails>
										<S.Detail>
											<S.DetailLabel>Region</S.DetailLabel>
											<S.DetailValue>{generation.region}</S.DetailValue>
										</S.Detail>
										<S.Detail>
											<S.DetailLabel>Released</S.DetailLabel>
											<S.DetailValue>{generation.releaseYear}</S.DetailValue>
										</S.Detail>
										<S.Detail>
											<S.DetailLabel>New Pokémon</S.DetailLabel>
											<S.DetailValue>{generation.pokemonCount}</S.DetailValue>
										</S.Detail>
									</S.GenerationDetails>
								</S.GenerationInfo>
							</S.GenerationCard>
						))}
					</S.GenerationsGrid>
				)}
			</S.GenerationsContainer>

			<Navbar ref={navRef} />
		</>
	);
};

export default GenerationsExplore;
