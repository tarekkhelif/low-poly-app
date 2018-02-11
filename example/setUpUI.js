import { camelize } from "./util/stringTools.js";

export function setUpUI() {
    // Workspace div
    const workspace = document.createElement("div");
    workspace.id = "workspace";
    document.body.appendChild(workspace);

    // Set up workspace
    this.setUpWorkspace(workspace);

    // Buttons div
    const buttons = document.createElement("div");
    buttons.id = "buttons";
    document.body.insertBefore(buttons, workspace);

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
            if (i + 1 < buttons.childNodes.length) {
                buttons.childNodes[i].disabled = true;
                buttons.childNodes[i + 1].disabled = false;
            }
        });
        buttons.appendChild(stageButton);
    });
}
