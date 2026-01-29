document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA CONFIGURATION
    // Defined outside the function for performance.
    // Fixed paths to use forward slashes (/) for cross-browser compatibility.
    const games = [
        { name: "3 Slices", url: "../Pages/Subpages/Gamellection Subpages/3Slices.html" },
        { name: "3 Slices 2", url: "../Pages/Subpages/Gamellection Subpages/3Slices2.html" },
        { name: "2048", url: "../Pages/Subpages/Gamellection Subpages/2048.html" },
        { name: "Achievement Unlocked", url: "../Pages/Subpages/Gamellection Subpages/AchievementUnlocked.html" },
        { name: "Antbuster", url: "../Pages/Subpages/Gamellection Subpages/Antbuster.html" },
        { name: "Awesome Planes", url: "../Pages/Subpages/Gamellection Subpages/AwesomePlanes.html" },
        { name: "Awesome Tanks", url: "../Pages/Subpages/Gamellection Subpages/AwesomeTanks.html" },
        { name: "Awesome Tanks 2", url: "../Pages/Subpages/Gamellection Subpages/AwesomeTanks2.html" },
        { name: "Big FLAPPY Tower VS Tiny Square", url: "../Pages/Subpages/Gamellection Subpages/BigFLAPPYTowerVSTinySquare.html" },
        { name: "Big ICE Tower Tiny Square", url: "../Pages/Subpages/Gamellection Subpages/BigICETowerTinySquare.html" },
        { name: "Big NEON Tower VS Tiny Square", url: "../Pages/Subpages/Gamellection Subpages/BigNEONTowerVSTinySquare.html" },
        { name: "Big Tower Tiny Square", url: "../Pages/Subpages/Gamellection Subpages/BigTowerTinySquare.html" },
        { name: "Big Tower Tiny Square 2", url: "../Pages/Subpages/Gamellection Subpages/BigTowerTinySquare2.html" },
        { name: "Bloons Tower Defense", url: "../Pages/Subpages/Gamellection Subpages/BTD.html" },
        { name: "Bloons Tower Defense 2", url: "../Pages/Subpages/Gamellection Subpages/BTD2.html" },
        { name: "Bloons Tower Defense 3", url: "../Pages/Subpages/Gamellection Subpages/BTD3.html" },
        { name: "Connect 4", url: "../Pages/Subpages/Gamellection Subpages/Connect4.html" },
        { name: "Cookie Clicker", url: "../Pages/Subpages/Gamellection Subpages/CookieClicker.html" },
        { name: "Escape Road", url: "../Pages/Subpages/Gamellection Subpages/EscapeRoad.html" },
        { name: "Five Nights at Winston's", url: "../Pages/Subpages/Gamellection Subpages/FiveNightsAtWinstons.html" },
        { name: "Google Snake", url: "../Pages/Subpages/Gamellection Subpages/GoogleSnake.html" },
        { name: "Hong Kong 97", url: "../Pages/Subpages/Gamellection Subpages/HongKong97.html" },
        { name: "Learn to Fly", url: "../Pages/Subpages/Gamellection Subpages/LearnToFly.html" },
        { name: "Learn to Fly 2", url: "../Pages/Subpages/Gamellection Subpages/LearnToFly2.html" },
        { name: "Learn to Fly 3", url: "../Pages/Subpages/Gamellection Subpages/LearnToFly3.html" },
        { name: "Minecraft Classic", url: "../Pages/Subpages/Gamellection Subpages/MinecraftClassic.html" },
        { name: "Moo Moo", url: "../Pages/Subpages/Gamellection Subpages/MooMoo.html" },
        { name: "n-gon", url: "../Pages/Subpages/Gamellection Subpages/n-gon.html" },
        { name: "New Super Mario Bros.", url: "../Pages/Subpages/Gamellection Subpages/NewSuperMarioBros.html" },
        { name: "Pac-Man", url: "../Pages/Subpages/Gamellection Subpages/Pac-Man.html" },
        { name: "Quick, Draw!", url: "../Pages/Subpages/Gamellection Subpages/QuickDrawWithGoogle.html" },
        { name: "Run 3", url: "../Pages/Subpages/Gamellection Subpages/Run3.html" },
        { name: "Shell Shockers", url: "../Pages/Subpages/Gamellection Subpages/ShellShockers.html" },
        { name: "Slope", url: "../Pages/Subpages/Gamellection Subpages/Slope.html" },
        { name: "Smash Karts", url: "../Pages/Subpages/Gamellection Subpages/SmashKarts.html" },
        { name: "Tetris", url: "../Pages/Subpages/Gamellection Subpages/Tetris.html" },
        { name: "Wordle+", url: "../Pages/Subpages/Gamellection Subpages/Wordle+.html" }
    ];

    // 2. DOM ELEMENT CACHING
    const searchInput = document.getElementById('searchInput');
    const resultContainer = document.getElementById('result');

    // 3. SEARCH LOGIC
    const handleSearch = () => {
        const query = searchInput.value.toLowerCase().trim();

        // If input is empty, clear the list and stop
        if (!query) {
            resultContainer.innerHTML = "";
            return;
        }

        // Filter the array
        const matches = games.filter(game => 
            game.name.toLowerCase().includes(query)
        );

        // Render Results
        if (matches.length > 0) {
            // Create a clean HTML list
            const listHtml = matches
                .map(game => `<li><a href="${game.url}">${game.name}</a></li>`)
                .join('');
            
            resultContainer.innerHTML = `<ul>${listHtml}</ul>`;
        } else {
            resultContainer.innerHTML = "rest in piss";
        }
    };

    // 4. DEBOUNCE & EVENT LISTENER
    // This makes the search wait 300ms after you stop typing.
    // It prevents the code from running 100 times if you type fast.
    let timeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(handleSearch, 300);
    });
});
