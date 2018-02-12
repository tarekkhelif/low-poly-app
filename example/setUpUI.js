import { camelize } from "./util/stringTools.js";

export function setUpUI() {
    // Container div
    const container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    // Workspace div
    const workspace = document.createElement("div");
    workspace.id = "workspace";
    container.appendChild(workspace);

    // Buttons div
    const controlPane = document.createElement("div");
    controlPane.id = "controlPane";
    container.insertBefore(controlPane, workspace);

    // Stage selector div
    const stageSelector = document.createElement("div");
    stageSelector.id = "stageSelector";
    controlPane.appendChild(stageSelector);

    // Stage tools div
    const stageTools = document.createElement("div");
    stageTools.id = "stageTools";
    controlPane.appendChild(stageTools);

    // Set up workspace
    this.setUpWorkspace(workspace);

    // Make list of stages
    const stages = [
        { name: "Get Image", function: this.getRaster.bind(this) },
        { name: "Outline Image", function: this.outlineRaster.bind(this) },
        { name: "Place Seeds", function: this.generateSites.bind(this, 100) },
        { name: "Draw Tesselation", function: this.generateVoronoi.bind(this) },
        { name: "Edit Tesselation", function: this.editTesselation.bind(this) },
        {
            name: "Export",
            function: () =>
                // eslint-disable-next-line no-console
                console.log("Sorry, exporting your art isn't supported yet.")
        }
    ];

    // Add buttons
    stages.forEach((stage, i) => {
        const stageButton = document.createElement("button");
        stageButton.id = camelize(stage.name);
        stageButton.innerHTML = stage.name;
        if (i > 0) stageButton.disabled = true;
        stageButton.addEventListener("click", async () => {
            await stage.function();
            // Disable current button, enable next button, unless on last stage
            if (i + 1 < stageSelector.childNodes.length) {
                stageSelector.childNodes[i].disabled = true;
                stageSelector.childNodes[i + 1].disabled = false;
            }
        });
        stageSelector.appendChild(stageButton);
    });
}
