/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-5
Release-004

File:
js/workspace/detail.js

Architecture:
Detail Workspace

Depends:
event-bus.js
project-store.js
workspace-state.js
model/shot.js

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

    class DetailWorkspace {

        constructor(){

            this.container = null;

            this.selectedShot = null;
        }

        //--------------------------------
        // Initialize
        //--------------------------------

        initialize(container){

            this.container = container;

            this.render();

            this.bindEvents();

            this.emit(
                "detail.initialized"
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

            <div class="detail-workspace">

                <div class="detail-header">

                    <div class="field">
                        <label>Shot ID</label>
                        <input
                            id="detail-shot-id"
                            readonly>
                    </div>

                    <div class="field">
                        <label>Shot Name</label>
                        <input
                            id="detail-shot-name">
                    </div>

                </div>

                <!-- Camera -->

                <fieldset>

                    <legend>
                        Camera
                    </legend>

                    <div class="field">
                        <label>
                            Camera Body
                        </label>
                        <input
                            id="detail-camera">
                    </div>

                    <div class="field">
                        <label>
                            Lens
                        </label>
                        <input
                            id="detail-lens">
                    </div>

                    <div class="field">
                        <label>
                            Filter
                        </label>
                        <input
                            id="detail-filter">
                    </div>

                    <div class="field">
                        <label>
                            FPS
                        </label>
                        <input
                            id="detail-fps">
                    </div>

                </fieldset>

                <!-- Audio -->

                <fieldset>

                    <legend>
                        Audio
                    </legend>

                    <div class="field">
                        <label>
                            Audio Type
                        </label>
                        <select
                            id="detail-audio">

                            <option>
                                同步收音
                            </option>

                            <option>
                                環境音
                            </option>

                            <option>
                                後期配音
                            </option>

                            <option>
                                無收音
                            </option>

                        </select>
                    </div>

                    <div class="field">
                        <label>
                            Microphone
                        </label>
                        <input
                            id="detail-mic">
                    </div>

                </fieldset>

                <!-- Lighting -->

                <fieldset>

                    <legend>
                        Lighting
                    </legend>

                    <div class="field">
                        <label>
                            Main Light
                        </label>
                        <input
                            id="detail-main-light">
                    </div>

                    <div class="field">
                        <label>
                            Fill Light
                        </label>
                        <input
                            id="detail-fill-light">
                    </div>

                    <div class="field">
                        <label>
                            Back Light
                        </label>
                        <input
                            id="detail-back-light">
                    </div>

                </fieldset>

                <!-- Props -->

                <fieldset>

                    <legend>
                        Props
                    </legend>

                    <textarea
                        id="detail-props">
                    </textarea>

                </fieldset>

                <!-- Costume -->

                <fieldset>

                    <legend>
                        Costume
                    </legend>

                    <textarea
                        id="detail-costume">
                    </textarea>

                </fieldset>

                <!-- Blocking -->

                <fieldset>

                    <legend>
                        Blocking
                    </legend>

                    <textarea
                        id="detail-blocking">
                    </textarea>

                </fieldset>

                <!-- Reference -->

                <fieldset>

                    <legend>
                        Reference
                    </legend>

                    <input
                        id="detail-reference">
                </fieldset>

                <!-- Storyboard -->

                <fieldset>

                    <legend>
                        Storyboard
                    </legend>

                    <textarea
                        id="detail-storyboard">
                    </textarea>

                </fieldset>

                <!-- AI -->

                <fieldset>

                    <legend>
                        AI Prompt
                    </legend>

                    <textarea
                        id="detail-ai">
                    </textarea>

                    <button
                        id="detail-generate">

                        Generate Storyboard
                    </button>

                </fieldset>

                <div class="detail-footer">

                    <button
                        id="detail-save">

                        Save
                    </button>

                </div>

            </div>
            `;
        }

        //--------------------------------
        // Select
        //--------------------------------

        selectShot(shot){

            this.selectedShot =
                shot;

            document
                .getElementById(
                    "detail-shot-id"
                )
                .value =
                    shot.displayId;

            document
                .getElementById(
                    "detail-shot-name"
                )
                .value =
                    shot.shotName || "";

            document
                .getElementById(
                    "detail-camera"
                )
                .value =
                    shot.camera || "";

            document
                .getElementById(
                    "detail-lens"
                )
                .value =
                    shot.lens || "";

            document
                .getElementById(
                    "detail-props"
                )
                .value =
                    (shot.props || [])
                        .join(",");

            document
                .getElementById(
                    "detail-costume"
                )
                .value =
                    (shot.costumes || [])
                        .join(",");

            document
                .getElementById(
                    "detail-blocking"
                )
                .value =
                    shot.blockingRef
                    || "";
        }

        //--------------------------------
        // Save
        //--------------------------------

        save(){

            if(
                !this.selectedShot
            ){
                return;
            }

            this.selectedShot
                .updateShot({

                    shotName:
                        document
                            .getElementById(
                                "detail-shot-name"
                            ).value,

                    camera:
                        document
                            .getElementById(
                                "detail-camera"
                            ).value,

                    lens:
                        document
                            .getElementById(
                                "detail-lens"
                            ).value,

                    props:
                        document
                            .getElementById(
                                "detail-props"
                            )
                            .value
                            .split(","),

                    costumes:
                        document
                            .getElementById(
                                "detail-costume"
                            )
                            .value
                            .split(","),

                    notes:
                        document
                            .getElementById(
                                "detail-blocking"
                            ).value
                });

            this.emit(
                "detail.saved",
                {
                    shotId:
                        this
                            .selectedShot
                            .internalId
                }
            );
        }

        //--------------------------------
        // AI Storyboard
        //--------------------------------

        generateStoryboard(){

            if(
                !this.selectedShot
            ){
                return;
            }

            this.emit(
                "ai.storyboard.request",
                {

                    shotId:
                        this
                            .selectedShot
                            .internalId,

                    prompt:
                        document
                            .getElementById(
                                "detail-ai"
                            ).value
                }
            );
        }

        //--------------------------------
        // Bind
        //--------------------------------

        bindEvents(){

            document
                .getElementById(
                    "detail-save"
                )
                .onclick =
                    ()=>this.save();

            document
                .getElementById(
                    "detail-generate"
                )
                .onclick =
                    ()=>this.generateStoryboard();

            global
                .AIDirector
                .EventBus
                .on(
                    "shot.selected",
                    e=>{

                        const shot =
                            global
                                .AIDirector
                                .ProjectStore
                                .getShot(
                                    e.payload
                                        .shotId
                                );

                        if(
                            shot
                        ){

                            this
                                .selectShot(
                                    shot
                                );
                        }
                    }
                );
        }

        //--------------------------------
        // Snapshot
        //--------------------------------

        snapshot(){

            return {

                timestamp:
                    Date.now(),

                shot:
                    this
                        .selectedShot
                        ?.internalId
            };
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
                    "DetailWorkspace"
                );
        }
    }

    global
        .AIDirector
        .WorkspaceUI
        .Detail =
            new DetailWorkspace();

})(window);
