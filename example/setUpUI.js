import { curry } from "./util/funcTools.js";
import { camelize } from "./util/stringTools.js";

export function setUpUI() {
    // Workspace div
    const workspace = document.createElement("div");
    workspace.id = "workspace";
    document.body.appendChild(workspace);

    // Make list of stages
    const stages = [
        { name: "Set Up", function: this.setUpWorkspace.bind(this, workspace) },
        { name: "Get Image", function: this.getRaster.bind(this) },
        { name: "Outline Image", function: this.outlineRaster.bind(this) },
        { name: "Place Seeds", function: this.generateSites.bind(this, 100) },
        { name: "Draw Tesselation", function: this.generateVoronoi.bind(this) },
        { name: "Edit Tesselation", function: this.editTesselation.bind(this) },
        {
            name: "Export",
            function: () =>
                console.log("Sorry, exporting your art isn't supported yet.")
        }
    ];

    // Buttons div
    const buttons = document.createElement("div");
    buttons.id = "buttons";
    document.body.insertBefore(buttons, workspace);

    // Add buttons
    stages.forEach((stage, i) => {
        const stageButton = document.createElement("button");
        stageButton.id = camelize(stage.name);
        stageButton.innerHTML = stage.name;
        stageButton.addEventListener("click", stage.function);
        buttons.appendChild(stageButton);
    });

    // const getRasterButton = document.createElement("button");
    // getRasterButton.id = "getRasterButton";
    // getRasterButton.innerHTML = "getRaster";
    // getRasterButton.addEventListener("click", () => this.getRaster());
    // buttons.appendChild(getRasterButton);

    // const outlineRasterButton = document.createElement("button");
    // outlineRasterButton.id = "outlineRasterButton";
    // outlineRasterButton.innerHTML = "outlineRaster";
    // outlineRasterButton.addEventListener("click", () => this.outlineRaster());
    // buttons.appendChild(outlineRasterButton);

    // const generateSitesButton = document.createElement("button");
    // generateSitesButton.id = "generateSitesButton";
    // generateSitesButton.innerHTML = "generateSites";
    // generateSitesButton.addEventListener("click", () =>
    //     this.generateSites(100));
    // buttons.appendChild(generateSitesButton);

    // const generateVoronoiButton = document.createElement("button");
    // generateVoronoiButton.id = "generateVoronoiButton";
    // generateVoronoiButton.innerHTML = "generateVoronoi";
    // generateVoronoiButton.addEventListener("click", () =>
    //     this.generateVoronoi());
    // buttons.appendChild(generateVoronoiButton);

    // const editTesselationButton = document.createElement("button");
    // editTesselationButton.id = "editTesselationButton";
    // editTesselationButton.innerHTML = "editTesselation";
    // editTesselationButton.addEventListener("click", () =>
    //     this.editTesselation());
    // buttons.appendChild(editTesselationButton);

    // const saveToComputerButton = document.createElement("button");
    // saveToComputerButton.id = "saveToComputerButton";
    // saveToComputerButton.innerHTML = "saveToComputer";
    // // saveToComputerButton.addEventListener("click", () => this.saveToComputer());
    // buttons.appendChild(saveToComputerButton);
}
