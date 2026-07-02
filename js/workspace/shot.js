/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-5
Release-003

File:
js/workspace/shot.js

Architecture:
Shot Workspace

Depends:
event-bus.js
project-store.js
model/shot.js
model/scene.js

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    if(!global.AIDirector){
        global.AIDirector = {};
    }

    if(!global.AIDirector.WorkspaceUI){
        global.AIDirector.WorkspaceUI = {};
    }

    class ShotWorkspace {

        constructor(){

            this.container = null;

            this.selectedShot = null;

            this.currentScene = null;
        }

        //--------------------------------
        // Initialize
        //--------------------------------

        initialize(container){

            this.container = container;

            this.render();

            this.bindEvents();

            this.emit(
                "shot.workspace.initialized"
            );
        }

        //--------------------------------
        // Render
        //--------------------------------

        render(){

            if(!this.container){
                return;
            }

            this.container.innerHTML = `

            <div class="shot-workspace">

                <div class="shot-toolbar">

                    <button id="shot-add">
                        + Shot
                    </button>

                </div>

                <div class="shot-body">

                    <div
                        class="shot-list"
                        id="shot-list">
                    </div>

                    <div
                        class="shot-detail"
                        id="shot-detail">

                        <!-- Basic -->

                        <div class="field">
                            <label>
                                Shot No
                            </label>
                            <input
                                id="shot-no">
                        </div>

                        <div class="field">
                            <label>
                                Shot Name
                            </label>
                            <input
                                id="shot-name">
                        </div>

                        <div class="field">
                            <label>
                                Description
                            </label>
                            <textarea
                                id="shot-description">
                            </textarea>
                        </div>

                        <!-- Camera -->

                        <div class="field">
                            <label>
                                Shot Size
                            </label>
                            <input
                                id="shot-size">
                        </div>

                        <div class="field">
                            <label>
                                Camera Angle
                            </label>
                            <input
                                id="shot-angle">
                        </div>

                        <div class="field">
                            <label>
                                Camera Height
                            </label>
                            <input
                                id="shot-height">
                        </div>

                        <div class="field">
                            <label>
                                Movement
                            </label>
                            <input
                                id="shot-movement">
                        </div>

                        <div class="field">
                            <label>
                                Lens
                            </label>
                            <input
                                id="shot-lens">
                        </div>

                        <!-- Horizontal -->

                        <fieldset>

                            <legend>
                                橫式拍攝
                            </legend>

                            <div class="field">
                                <label>
                                    Ratio
                                </label>

                                <input
                                    id="horizontal-ratio">
                            </div>

                            <div class="field">
                                <label>
                                    Resolution
                                </label>

                                <input
                                    id="horizontal-resolution">
                            </div>

                            <div class="field">
                                <label>
                                    Camera
                                </label>

                                <input
                                    id="horizontal-camera">
                            </div>

                            <div class="field">
                                <label>
                                    FPS
                                </label>

                                <input
                                    id="horizontal-fps">
                            </div>

                        </fieldset>

                        <!-- Vertical -->

                        <fieldset>

                            <legend>
                                直式拍攝
                            </legend>

                            <div class="field">
                                <label>
                                    Ratio
                                </label>

                                <input
                                    id="vertical-ratio">
                            </div>

                            <div class="field">
                                <label>
                                    Resolution
                                </label>

                                <input
                                    id="vertical-resolution">
                            </div>

                            <div class="field">
                                <label>
                                    Camera
                                </label>

                                <input
                                    id="vertical-camera">
                            </div>

                            <div class="field">
                                <label>
                                    FPS
                                </label>

                                <input
                                    id="vertical-fps">
                            </div>

                        </fieldset>

                        <div class="field">
                            <label>
                                Duration
                            </label>

                            <input
                                id="shot-duration"
                                type="number">
                        </div>

                        <div class="field">
                            <label>
                                Notes
                            </label>

                            <textarea
                                id="shot-notes">
                            </textarea>
                        </div>

                        <button
                            id="shot-save">

                            Save
                        </button>

                    </div>

                </div>

            </div>
            `;

            this.renderShotList();
        }

        //--------------------------------
        // Shot List
        //--------------------------------

        renderShotList(){

            const list =
                document
                    .getElementById(
                        "shot-list"
                    );

            if(!list){
                return;
            }

            list.innerHTML = "";

            const shots =
                global
                    .AIDirector
                    .ProjectStore
                    .getAllShots();

            shots.forEach(
                shot=>{

                    const item =
                        document
                            .createElement(
                                "div"
                            );

                    item.className =
                        "shot-item";

                    item.innerHTML =

                        `
                        <div>
                            ${shot.displayId}
                        </div>

                        <div>
                            ${shot.shotName}
                        </div>
                        `;

                    item.onclick =
                        ()=>{

                            this.selectShot(
                                shot
                            );
                        };

                    list.appendChild(
                        item
                    );
                }
            );
        }

        //--------------------------------
        // Add
        //--------------------------------

        addShot(){

            const id =
                "SHT-" +
                Date.now();

            const shot =
                new global
                    .AIDirector
                    .Model
                    .Shot(
                        id,
                        "SHOT-" +
                        (
                            global
                                .AIDirector
                                .ProjectStore
                                .shotOrder
                                .length
                            +1
                        )
                    );

            if(
                this.currentScene
            ){

                shot.addScene(
                    this.currentScene
                        .internalId
                );

                this.currentScene
                    .addShot(
                        id
                    );
            }

            global
                .AIDirector
                .ProjectStore
                .createShot(
                    shot
                );

            this.renderShotList();

            this.selectShot(
                shot
            );
        }

        //--------------------------------
        // Select
        //--------------------------------

        selectShot(
            shot
        ){

            this.selectedShot =
                shot;

            shot.select();

            document
                .getElementById(
                    "shot-no"
                )
                .value =
                    shot.shotNo;

            document
                .getElementById(
                    "shot-name"
                )
                .value =
                    shot.shotName;

            document
                .getElementById(
                    "shot-description"
                )
                .value =
                    shot.description;

            document
                .getElementById(
                    "shot-size"
                )
                .value =
                    shot.size;

            document
                .getElementById(
                    "shot-angle"
                )
                .value =
                    shot.angle;

            document
                .getElementById(
                    "shot-height"
                )
                .value =
                    shot.height;

            document
                .getElementById(
                    "shot-movement"
                )
                .value =
                    shot.movement;

            document
                .getElementById(
                    "shot-lens"
                )
                .value =
                    shot.lens;

            document
                .getElementById(
                    "horizontal-ratio"
                )
                .value =
                    shot
                        .horizontal
                        .ratio;

            document
                .getElementById(
                    "horizontal-resolution"
                )
                .value =
                    shot
                        .horizontal
                        .resolution;

            document
                .getElementById(
                    "horizontal-camera"
                )
                .value =
                    shot
                        .horizontal
                        .cameraRef;

            document
                .getElementById(
                    "horizontal-fps"
                )
                .value =
                    shot
                        .horizontal
                        .fps;

            document
                .getElementById(
                    "vertical-ratio"
                )
                .value =
                    shot
                        .vertical
                        .ratio;

            document
                .getElementById(
                    "vertical-resolution"
                )
                .value =
                    shot
                        .vertical
                        .resolution;

            document
                .getElementById(
                    "vertical-camera"
                )
                .value =
                    shot
                        .vertical
                        .cameraRef;

            document
                .getElementById(
                    "vertical-fps"
                )
                .value =
                    shot
                        .vertical
                        .fps;

            document
                .getElementById(
                    "shot-duration"
                )
                .value =
                    shot.duration;

            document
                .getElementById(
                    "shot-notes"
                )
                .value =
                    shot.notes;
        }

        //--------------------------------
        // Save
        //--------------------------------

        saveShot(){

            if(
                !this.selectedShot
            ){
                return;
            }

            this.selectedShot
                .updateShot({

                    shotNo:
                        document
                            .getElementById(
                                "shot-no"
                            ).value,

                    shotName:
                        document
                            .getElementById(
                                "shot-name"
                            ).value,

                    description:
                        document
                            .getElementById(
                                "shot-description"
                            ).value,

                    size:
                        document
                            .getElementById(
                                "shot-size"
                            ).value,

                    angle:
                        document
                            .getElementById(
                                "shot-angle"
                            ).value,

                    height:
                        document
                            .getElementById(
                                "shot-height"
                            ).value,

                    movement:
                        document
                            .getElementById(
                                "shot-movement"
                            ).value,

                    lens:
                        document
                            .getElementById(
                                "shot-lens"
                            ).value,

                    duration:
                        parseInt(
                            document
                                .getElementById(
                                    "shot-duration"
                                )
                                .value || 0
                        ),

                    notes:
                        document
                            .getElementById(
                                "shot-notes"
                            ).value
                });

            this.selectedShot
                .horizontal
                .ratio =
                    document
                        .getElementById(
                            "horizontal-ratio"
                        ).value;

            this.selectedShot
                .horizontal
                .resolution =
                    document
                        .getElementById(
                            "horizontal-resolution"
                        ).value;

            this.selectedShot
                .horizontal
                .cameraRef =
                    document
                        .getElementById(
                            "horizontal-camera"
                        ).value;

            this.selectedShot
                .horizontal
                .fps =
                    parseInt(
                        document
                            .getElementById(
                                "horizontal-fps"
                            )
                            .value || 24
                    );

            this.selectedShot
                .vertical
                .ratio =
                    document
                        .getElementById(
                            "vertical-ratio"
                        ).value;

            this.selectedShot
                .vertical
                .resolution =
                    document
                        .getElementById(
                            "vertical-resolution"
                        ).value;

            this.selectedShot
                .vertical
                .cameraRef =
                    document
                        .getElementById(
                            "vertical-camera"
                        ).value;

            this.selectedShot
                .vertical
                .fps =
                    parseInt(
                        document
                            .getElementById(
                                "vertical-fps"
                            )
                            .value || 24
                    );

            this.renderShotList();

            this.emit(
                "shot.saved"
            );
        }

        //--------------------------------
        // Events
        //--------------------------------

        bindEvents(){

            document
                .getElementById(
                    "shot-add"
                )
                .onclick =
                    ()=>this.addShot();

            document
                .getElementById(
                    "shot-save"
                )
                .onclick =
                    ()=>this.saveShot();

            global
                .AIDirector
                .EventBus
                .on(
                    "scene.selected",
                    e=>{

                        this.currentScene =
                            global
                                .AIDirector
                                .ProjectStore
                                .getScene(
                                    e.payload
                                        .sceneId
                                );
                    }
                );
        }

        //--------------------------------
        // EventBus
        //--------------------------------

        emit(
            namespace,
            payload={}
        ){

            global
                .AIDirector
                .EventBus
                .emit(
                    namespace,
                    payload,
                    "ShotWorkspace"
                );
        }
    }

    global
        .AIDirector
        .WorkspaceUI
        .Shot =
            new ShotWorkspace();

})(window);
