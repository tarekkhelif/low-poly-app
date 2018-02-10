export function setUpUI() {
    // Workspace div
    const workspace = document.createElement("div");
    workspace.id = "workspace";
    document.body.appendChild(workspace);

    // Buttons div
    const buttons = document.createElement("div");
    buttons.id = "buttons";
    document.body.insertBefore(buttons, workspace);

    // Add buttons
    const setUpWorkspaceButton = document.createElement("button");
    setUpWorkspaceButton.id = "setUpWorkspaceButton";
    setUpWorkspaceButton.innerHTML = "setUpWorkspace";
    setUpWorkspaceButton.addEventListener("click", () =>
        this.setUpWorkspace(workspace));
    buttons.appendChild(setUpWorkspaceButton);

    const getRasterButton = document.createElement("button");
    getRasterButton.id = "getRasterButton";
    getRasterButton.innerHTML = "getRaster";
    getRasterButton.addEventListener("click", () => this.getRaster());
    buttons.appendChild(getRasterButton);

    const outlineRasterButton = document.createElement("button");
    outlineRasterButton.id = "outlineRasterButton";
    outlineRasterButton.innerHTML = "outlineRaster";
    outlineRasterButton.addEventListener("click", () => this.outlineRaster());
    buttons.appendChild(outlineRasterButton);

    const generateSitesButton = document.createElement("button");
    generateSitesButton.id = "generateSitesButton";
    generateSitesButton.innerHTML = "generateSites";
    generateSitesButton.addEventListener("click", () =>
        this.generateSites(100));
    buttons.appendChild(generateSitesButton);

    const generateVoronoiButton = document.createElement("button");
    generateVoronoiButton.id = "generateVoronoiButton";
    generateVoronoiButton.innerHTML = "generateVoronoi";
    generateVoronoiButton.addEventListener("click", () =>
        this.generateVoronoi());
    buttons.appendChild(generateVoronoiButton);

    const editTesselationButton = document.createElement("button");
    editTesselationButton.id = "editTesselationButton";
    editTesselationButton.innerHTML = "editTesselation";
    editTesselationButton.addEventListener("click", () =>
        this.editTesselation());
    buttons.appendChild(editTesselationButton);

    const saveToComputerButton = document.createElement("button");
    saveToComputerButton.id = "saveToComputerButton";
    saveToComputerButton.innerHTML = "saveToComputer";
    // saveToComputerButton.addEventListener("click", () => this.saveToComputer());
    buttons.appendChild(saveToComputerButton);
}
