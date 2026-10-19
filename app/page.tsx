
import SearchBox from "./SearchBox";
import TravelWorlds from "./TravelWorlds";

export default function Home() {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <SearchBox />
      <TravelWorlds />
    </main>
  );
}
