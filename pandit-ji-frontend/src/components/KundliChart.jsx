const KundliChart = ({ houses = [], planets = {} }) => {

  // 🔥 House Map
  const houseMap = {};
  houses.forEach((h) => {
    houseMap[h.house] = h;
  });

  // 🔥 Planet → House Mapping
  const planetMap = {};
  Object.entries(planets).forEach(([key, value]) => {
    if (!value) return;

    const house = value.house;
    if (!planetMap[house]) planetMap[house] = [];
    planetMap[house].push(key);
  });

  return (
    <div className="flex justify-center my-6 px-2">

      <div className="
        grid grid-cols-3 grid-rows-3 
        w-full max-w-[320px] 
        sm:max-w-[420px] 
        md:max-w-[520px] 
        aspect-square 
        border-2 border-orange-400 
        bg-white shadow-xl rounded-2xl p-1
      ">

        {/* 🔝 TOP */}
        <Box house={houseMap[12]} planets={planetMap[12]} />
        <Box house={houseMap[1]} planets={planetMap[1]} highlight />
        <Box house={houseMap[2]} planets={planetMap[2]} />

        {/* 🔄 MIDDLE */}
        <Box house={houseMap[11]} planets={planetMap[11]} />
        <CenterBox />
        <Box house={houseMap[3]} planets={planetMap[3]} />

        {/* 🔽 BOTTOM */}
        <Box house={houseMap[10]} planets={planetMap[10]} />
        <Box house={houseMap[9]} planets={planetMap[9]} />
        <Box house={houseMap[4]} planets={planetMap[4]} />

      </div>
    </div>
  );
};



// 🔥 PLANET SYMBOLS
const planetSymbols = {
  sun: "☀️",
  moon: "🌙",
  mars: "♂️",
  mercury: "☿",
  jupiter: "♃",
  venus: "♀",
  saturn: "♄",
  ascendant: "⬆️",
};


// 🔥 HOUSE BOX
const Box = ({ house, planets, highlight }) => {
  return (
    <div
      className={`
        border border-orange-200 
        flex flex-col justify-between 
        items-center p-1 
        relative
        ${highlight ? "bg-orange-50 border-orange-400" : ""}
      `}
    >

      {/* 🔹 HOUSE NUMBER */}
      <div className="absolute top-1 left-1 text-[9px] sm:text-[10px] text-gray-400">
        {house?.house || ""}
      </div>

      {/* 🔥 PLANETS */}
      <div className="flex flex-wrap justify-center items-center gap-1 text-base sm:text-lg md:text-xl">

        {planets?.length ? (
          planets.map((p) => (
            <span
              key={p}
              className="bg-orange-100 px-1.5 py-[1px] rounded-md text-[10px] sm:text-xs md:text-sm"
            >
              {planetSymbols[p] || p.charAt(0).toUpperCase()}
            </span>
          ))
        ) : (
          <span className="text-gray-300 text-[10px]">—</span>
        )}

      </div>

      {/* 🔹 SIGN */}
      <div className="text-[9px] sm:text-[10px] text-gray-400 text-center">
        {house?.sign || ""}
      </div>

    </div>
  );
};


// 🔥 CENTER BOX
const CenterBox = () => {
  return (
    <div className="
      border border-orange-200 
      flex flex-col items-center justify-center 
      text-[10px] sm:text-xs md:text-sm 
      font-semibold text-gray-500
      bg-gradient-to-br from-orange-50 to-white
    ">
      🔮
      <span>Kundli</span>
    </div>
  );
};


export default KundliChart;