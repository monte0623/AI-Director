/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-5
Release-005

File:
js/workspace/storyboard.js

Architecture:
Storyboard Workspace

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

    class StoryboardWorkspace {

        constructor(){

            this.container = null;

            this.selectedShot = null;

            this.storyboard = {
                referenceImage : "",
                aiPrompt : "",
                composition : "",
                cameraDiagram : "",
                characterPosition : "",
                frameNotes : "",
                horizontal : {
                    image : "",
                    prompt : ""
                },
                vertical : {
                    image : "",
                    prompt : ""
                }
            };
        }

        //--------------------------------
        // Initialize
        //--------------------------------

        initialize(container){

            this.container = container;

            this.render();

            this.bindEvents();

            this.emit(
                "storyboard.initialized"
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

            <div class="storyboard-workspace">

                <!-- Header -->

                <div class="storyboard-header">

                    <div class="field">

                        <label>
                            Shot ID
                        </label>

                        <input
                            id="storyboard-shot-id"
                            readonly>

                    </div>

                    <div class="field">

                        <label>
                            Shot Name
                        </label>

                        <input
                            id="storyboard-shot-name">

                    </div>

                </div>

                <!-- Reference -->

                <fieldset>

                    <legend>
                        Reference Image
                    </legend>

                    <input
                        id="storyboard-reference">

                </fieldset>

                <!-- Composition -->

                <fieldset>

                    <legend>
                        Shot Composition
                    </legend>

                    <textarea
                        id="storyboard-composition">
                    </textarea>

                </fieldset>

                <!-- Camera Diagram -->

                <fieldset>

                    <legend>
                        Camera Diagram
                    </legend>

                    <textarea
                        id="storyboard-camera">
                    </textarea>

                </fieldset>

                <!-- Character -->

                <fieldset>

                    <legend>
                        Character Position
                    </legend>

                    <textarea
                        id="storyboard-character">
                    </textarea>

                </fieldset>

                <!-- Frame -->

                <fieldset>

                    <legend>
                        Frame Notes
                    </legend>

                    <textarea
                        id="storyboard-notes">
                    </textarea>

                </fieldset>

                <!-- AI -->

                <fieldset>

                    <legend>
                        AI Storyboard Prompt
                    </legend>

                    <textarea
                        id="storyboard-ai">
                    </textarea>

                </fieldset>

                <!-- Horizontal -->

                <fieldset>

                    <legend>
                        橫式 Storyboard
                    </legend>

                    <div class="field">

                        <label>
                            Prompt
                        </label>

                        <textarea
                            id="storyboard-horizontal-prompt">
                        </textarea>

                    </div>

                    <div
                        class="storyboard-preview"
                        id="storyboard-horizontal-image">

                        No Image

                    </div>

                    <button
                        id="generate-horizontal">

                        Generate Horizontal
                    </button>

                </fieldset>

                <!-- Vertical -->

                <fieldset>

                    <legend>
                        直式 Storyboard
                    </legend>

                    <div class="field">

                        <label>
                            Prompt
                        </label>

                        <textarea
                            id="storyboard-vertical-prompt">
                        </textarea>

                    </div>

                    <div
                        class="storyboard-preview"
                        id="storyboard-vertical-image">

                        No Image

                    </div>

                    <button
                        id="generate-vertical">

                        Generate Vertical
                    </button>

                </fieldset>

                <!-- Footer -->

                <div class="storyboard-footer">

                    <button
                        id="storyboard-save">

                        Save
                    </button>

                </div>

            </div>
            `;
        }

        //--------------------------------
        // Select Shot
        //--------------------------------

        selectShot(shot){

            this.selectedShot = shot;

            document
                .getElementById(
                    "storyboard-shot-id"
                )
                .value =
                    shot.displayId;

            document
                .getElementById(
                    "storyboard-shot-name"
                )
                .value =
                    shot.shotName || "";
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

            this.storyboard.referenceImage =
                document
                    .getElementById(
                        "storyboard-reference"
                    )
                    .value;

            this.storyboard.composition =
                document
                    .getElementById(
                        "storyboard-composition"
                    )
                    .value;

            this.storyboard.cameraDiagram =
                document
                    .getElementById(
                        "storyboard-camera"
                    )
                    .value;

            this.storyboard.characterPosition =
                document
                    .getElementById(
                        "storyboard-character"
                    )
                    .value;

            this.storyboard.frameNotes =
                document
                    .getElementById(
                        "storyboard-notes"
                    )
                    .value;

            this.storyboard.aiPrompt =
                document
                    .getElementById(
                        "storyboard-ai"
                    )
                    .value;

            this.storyboard.horizontal.prompt =
                document
                    .getElementById(
                        "storyboard-horizontal-prompt"
                    )
                    .value;

            this.storyboard.vertical.prompt =
                document
                    .getElementById(
                        "storyboard-vertical-prompt"
                    )
                    .value;

            this.selectedShot
                .setStoryboard(
                    structuredClone(
                        this.storyboard
                    )
                );

            this.emit(
                "storyboard.saved",
                {
                    shotId:
                        this.selectedShot
                            .internalId
                }
            );
        }

        //--------------------------------
        // Generate Horizontal
        //--------------------------------

        generateHorizontal(){

            if(
                !this.selectedShot
            ){
                return;
            }

            this.emit(
                "ai.storyboard.horizontal",
                {

                    shotId:
                        this.selectedShot
                            .internalId,

                    prompt:
                        document
                            .getElementById(
                                "storyboard-horizontal-prompt"
                            )
                            .value
                }
            );
        }

        //--------------------------------
        // Generate Vertical
        //--------------------------------

        generateVertical(){

            if(
                !this.selectedShot
            ){
                return;
            }

            this.emit(
                "ai.storyboard.vertical",
                {

                    shotId:
                        this.selectedShot
                            .internalId,

                    prompt:
                        document
                            .getElementById(
                                "storyboard-vertical-prompt"
                            )
                            .value
                }
            );
        }

        //--------------------------------
        // Set Image
        //--------------------------------

        setHorizontalImage(
            imageUrl
        ){

            this.storyboard
                .horizontal
                .image =
                    imageUrl;

            document
                .getElementById(
                    "storyboard-horizontal-image"
                )
                .innerHTML =
                    `<img src="${imageUrl}">`;
        }

        setVerticalImage(
            imageUrl
        ){

            this.storyboard
                .vertical
                .image =
                    imageUrl;

            document
                .getElementById(
                    "storyboard-vertical-image"
                )
                .innerHTML =
                    `<img src="${imageUrl}">`;
        }

        //--------------------------------
        // Bind
        //--------------------------------

        bindEvents(){

            document
                .getElementById(
                    "storyboard-save"
                )
                .onclick =
                    ()=>this.save();

            document
                .getElementById(
                    "generate-horizontal"
                )
                .onclick =
                    ()=>this.generateHorizontal();

            document
                .getElementById(
                    "generate-vertical"
                )
                .onclick =
                    ()=>this.generateVertical();

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

                storyboard:
                    structuredClone(
                        this.storyboard
                    )
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
                    "StoryboardWorkspace"
                );
        }
    }

    global
        .AIDirector
        .WorkspaceUI
        .Storyboard =
            new StoryboardWorkspace();

})(window);
