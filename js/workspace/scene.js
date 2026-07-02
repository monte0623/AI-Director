/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-5
Release-002

File:
js/workspace/scene.js

Architecture:
Scene Workspace

Depends:
event-bus.js
project-store.js
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

    class SceneWorkspace {

        constructor(){

            this.container = null;

            this.selectedScene = null;
        }

        //--------------------------------
        // Initialize
        //--------------------------------

        initialize(container){

            this.container = container;

            this.render();

            this.bindEvents();

            this.emit(
                "scene.workspace.initialized"
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

            <div class="scene-workspace">

                <div class="scene-toolbar">

                    <button id="scene-add">
                        + Scene
                    </button>

                </div>

                <div class="scene-body">

                    <div
                        class="scene-list"
                        id="scene-list">
                    </div>

                    <div
                        class="scene-detail"
                        id="scene-detail">

                        <div class="field">
                            <label>Scene No</label>
                            <input id="scene-no">
                        </div>

                        <div class="field">
                            <label>Scene Name</label>
                            <input id="scene-name">
                        </div>

                        <div class="field">
                            <label>Location</label>
                            <input id="scene-location">
                        </div>

                        <div class="field">
                            <label>Time</label>
                            <select id="scene-time">
                                <option>清晨</option>
                                <option>早上</option>
                                <option>下午</option>
                                <option>黃昏</option>
                                <option>夜晚</option>
                            </select>
                        </div>

                        <div class="field">
                            <label>Actors</label>
                            <input id="scene-actors">
                        </div>

                        <div class="field">
                            <label>Audio</label>
                            <select id="scene-audio">
                                <option>同步收音</option>
                                <option>環境音</option>
                                <option>不收音</option>
                            </select>
                        </div>

                        <div class="field">
                            <label>Camera</label>
                            <select id="scene-camera">
                                <option>單機</option>
                                <option>雙機</option>
                                <option>手機</option>
                            </select>
                        </div>

                        <div class="field">
                            <label>Lighting</label>
                            <input id="scene-lighting">
                        </div>

                        <div class="field">
                            <label>Notes</label>
                            <textarea
                                id="scene-notes">
                            </textarea>
                        </div>

                        <div class="field">
                            <label>Status</label>
                            <select
                                id="scene-status">
                                <option>
                                    draft
                                </option>
                                <option>
                                    planned
                                </option>
                                <option>
                                    ready
                                </option>
                                <option>
                                    shooting
                                </option>
                                <option>
                                    completed
                                </option>
                            </select>
                        </div>

                        <button
                            id="scene-save">

                            Save
                        </button>

                    </div>

                </div>

            </div>
            `;

            this.renderSceneList();
        }

        //--------------------------------
        // Scene List
        //--------------------------------

        renderSceneList(){

            const list =
                document
                    .getElementById(
                        "scene-list"
                    );

            if(!list){
                return;
            }

            list.innerHTML = "";

            const scenes =
                global
                    .AIDirector
                    .ProjectStore
                    .getAllScenes();

            scenes.forEach(
                scene=>{

                    const item =
                        document
                            .createElement(
                                "div"
                            );

                    item.className =
                        "scene-item";

                    item.innerHTML =

                        `
                        <div>
                            ${
                                scene.displayId
                            }
                        </div>

                        <div>
                            ${
                                scene.sceneName
                            }
                        </div>
                        `;

                    item.onclick =
                        ()=>{

                            this.selectScene(
                                scene
                            );
                        };

                    list
                        .appendChild(
                            item
                        );
                }
            );
        }

        //--------------------------------
        // Add
        //--------------------------------

        addScene(){

            const id =
                "SCN-" +
                Date.now();

            const scene =
                new global
                    .AIDirector
                    .Model
                    .Scene(
                        id,
                        "S" +
                        (
                            global
                                .AIDirector
                                .ProjectStore
                                .sceneOrder
                                .length
                            +1
                        )
                    );

            global
                .AIDirector
                .ProjectStore
                .createScene(
                    scene
                );

            const project =
                global
                    .AIDirector
                    .ProjectStore
                    .getProject();

            if(project){

                project
                    .addScene(
                        id
                    );
            }

            this.renderSceneList();

            this.selectScene(
                scene
            );
        }

        //--------------------------------
        // Select
        //--------------------------------

        selectScene(
            scene
        ){

            this.selectedScene =
                scene;

            scene.select();

            document
                .getElementById(
                    "scene-no"
                )
                .value =
                    scene.sceneNo;

            document
                .getElementById(
                    "scene-name"
                )
                .value =
                    scene.sceneName;

            document
                .getElementById(
                    "scene-location"
                )
                .value =
                    scene.location;

            document
                .getElementById(
                    "scene-time"
                )
                .value =
                    scene.time;

            document
                .getElementById(
                    "scene-actors"
                )
                .value =
                    scene.actors
                        .join(",");

            document
                .getElementById(
                    "scene-lighting"
                )
                .value =
                    scene.lighting;

            document
                .getElementById(
                    "scene-notes"
                )
                .value =
                    scene.notes;

            document
                .getElementById(
                    "scene-status"
                )
                .value =
                    scene.status;
        }

        //--------------------------------
        // Save
        //--------------------------------

        saveScene(){

            if(
                !this.selectedScene
            ){
                return;
            }

            this.selectedScene
                .updateScene({

                    sceneNo:
                        document
                            .getElementById(
                                "scene-no"
                            ).value,

                    sceneName:
                        document
                            .getElementById(
                                "scene-name"
                            ).value,

                    location:
                        document
                            .getElementById(
                                "scene-location"
                            ).value,

                    time:
                        document
                            .getElementById(
                                "scene-time"
                            ).value,

                    actors:
                        document
                            .getElementById(
                                "scene-actors"
                            )
                            .value
                            .split(","),

                    lighting:
                        document
                            .getElementById(
                                "scene-lighting"
                            ).value,

                    notes:
                        document
                            .getElementById(
                                "scene-notes"
                            ).value,

                    status:
                        document
                            .getElementById(
                                "scene-status"
                            ).value
                });

            this.renderSceneList();

            this.emit(
                "scene.saved"
            );
        }

        //--------------------------------
        // Events
        //--------------------------------

        bindEvents(){

            document
                .getElementById(
                    "scene-add"
                )
                .onclick =
                    ()=>this.addScene();

            document
                .getElementById(
                    "scene-save"
                )
                .onclick =
                    ()=>this.saveScene();

            global
                .AIDirector
                .EventBus
                .on(
                    "scene.created",
                    ()=>{

                        this
                            .renderSceneList();
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
                    "SceneWorkspace"
                );
        }
    }

    global
        .AIDirector
        .WorkspaceUI
        .Scene =
            new SceneWorkspace();

})(window);
