function settingsPopUp(){
    const buttons = [
        {
            label: "Start Game",
            action: () => alert("Game Started!"),
        },
        {
            label: "Load Game",
            action: () => alert("Load Game Clicked!"),
        },
        {
            label: "Settings",
            action: () => alert("Settings Opened!"),
        },
    ];

    createPopupWithButtons("h1", "Settings", {width: "400px", height: "250px"}, buttons);
}