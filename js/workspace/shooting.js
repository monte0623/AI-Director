/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-5
Release-006

File:
js/workspace/shooting.js

Architecture:
Shooting Workspace

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

    const TakeStatus = {

        WAITING : "waiting",
        GOOD    : "good",
        NG      : "ng",
        BEST    : "best"
    };

    class ShootingWorkspace {

        constructor(){

            this.container = null;

            this.selectedShot = null;

            this.currentTake = 1;

            this.takeList = [];
        }

        //--------------------------------
        // Initialize
        //--------------------------------

        initialize(container){

            this.container = container;

            this.render();

            this.bindEvents();

            this.emit(
                "shooting.initialized"
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

            <div class="shooting-workspace">

                <!-- Header -->

                <div class="shooting-header">

                    <div class="field">

                        <label>
                            Shot ID
                        </label>

                        <input
                            id="shoot-shot-id"
                            readonly>

                    </div>

                    <div class="field">

                        <label>
                            Shot Name
                        </label>

                        <input
                            id="shoot-shot-name"
                            readonly>

                    </div>

                </div>

                <!-- Mode -->

                <fieldset>

                    <legend>
                        Shooting Mode
                    </legend>

                    <label>
                        <input
                            type="checkbox"
                            id="shoot-horizontal"
                            checked>

                        橫式拍攝
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            id="shoot-vertical"
                            checked>

                        直式拍攝
                    </label>

                </fieldset>

                <!-- Checklist -->

                <fieldset>

                    <legend>
                        Shot Checklist
                    </legend>

                    <label>
                        <input
                            type="checkbox"
                            id="check-camera">

                        Camera
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            id="check-audio">

                        Audio
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            id="check-light">

                        Lighting
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            id="check-actor">

                        Actor
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            id="check-props">

                        Props
                    </label>

                </fieldset>

                <!-- Status -->

                <fieldset>

                    <legend>
                        Production Status
                    </legend>

                    <div class="field">

                        <label>
                            Camera
                        </label>

                        <select
                            id="camera-status">

                            <option>
                                Ready
                            </option>

                            <option>
                                Busy
                            </option>

                            <option>
                                Error
                            </option>

                        </select>

                    </div>

                    <div class="field">

                        <label>
                            Audio
                        </label>

                        <select
                            id="audio-status">

                            <option>
                                Ready
                            </option>

                            <option>
                                Busy
                            </option>

                            <option>
                                Error
                            </option>

                        </select>

                    </div>

                    <div class="field">

                        <label>
                            Lighting
                        </label>

                        <select
                            id="lighting-status">

                            <option>
                                Ready
                            </option>

                            <option>
                                Busy
                            </option>

                            <option>
                                Error
                            </option>

                        </select>

                    </div>

                </fieldset>

                <!-- Take -->

                <fieldset>

                    <legend>
                        Take Management
                    </legend>

                    <div
                        id="take-list">
                    </div>

                    <button
                        id="add-take">

                        + Take
                    </button>

                </fieldset>

                <!-- Live Script -->

                <fieldset>

                    <legend>
                        Live Script
                    </legend>

                    <textarea
                        id="live-script">
                    </textarea>

                </fieldset>

                <!-- Progress -->

                <fieldset>

                    <legend>
                        Shot Progress
                    </legend>

                    <progress
                        id="shot-progress"
                        max="100"
                        value="0">
                    </progress>

                    <span
                        id="shot-progress-text">

                        0%
                    </span>

                </fieldset>

                <!-- Notes -->

                <fieldset>

                    <legend>
                        Shooting Notes
                    </legend>

                    <textarea
                        id="shooting-notes">
                    </textarea>

                </fieldset>

                <!-- Footer -->

                <div
                    class="shooting-footer">

                    <button
                        id="shooting-save">

                        Save
                    </button>

                    <button
                        id="shooting-complete">

                        Complete
                    </button>

                </div>

            </div>
            `;
        }

        //--------------------------------
        // Select Shot
        //--------------------------------

        selectShot(shot){

            this.selectedShot =
                shot;

            document
                .getElementById(
                    "shoot-shot-id"
                )
                .value =
                    shot.displayId;

            document
                .getElementById(
                    "shoot-shot-name"
                )
                .value =
                    shot.shotName;
        }

        //--------------------------------
        // Take
        //--------------------------------

        addTake(){

            const take = {

                number:
                    this.currentTake,

                status:
                    TakeStatus
                        .WAITING,

                note:"",

                createdAt:
                    Date.now()
            };

            this.takeList
                .push(
                    take
                );

            this.currentTake++;

            this.renderTakeList();

            this.emit(
                "shooting.take.created",
                take
            );
        }

        renderTakeList(){

            const list =
                document
                    .getElementById(
                        "take-list"
                    );

            if(!list){
                return;
            }

            list.innerHTML = "";

            this.takeList
                .forEach(
                    take=>{

                        const item =
                            document
                                .createElement(
                                    "div"
                                );

                        item.className =
                            "take-item";

                        item.innerHTML = `

                            <span>
                                Take
                                ${take.number}
                            </span>

                            <select
                                data-take="${
                                    take.number
                                }">

                                <option>
                                    waiting
                                </option>

                                <option>
                                    good
                                </option>

                                <option>
                                    ng
                                </option>

                                <option>
                                    best
                                </option>

                            </select>
                        `;

                        list
                            .appendChild(
                                item
                            );
                    }
                );
        }

        //--------------------------------
        // Progress
        //--------------------------------

        setProgress(
            value
        ){

            const progress =
                document
                    .getElementById(
                        "shot-progress"
                    );

            const text =
                document
                    .getElementById(
                        "shot-progress-text"
                    );

            progress.value =
                value;

            text.innerText =
                value + "%";
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
                .setShooting({

                    horizontal:
                        document
                            .getElementById(
                                "shoot-horizontal"
                            ).checked,

                    vertical:
                        document
                            .getElementById(
                                "shoot-vertical"
                            ).checked,

                    takes:
                        structuredClone(
                            this.takeList
                        ),

                    liveScript:
                        document
                            .getElementById(
                                "live-script"
                            ).value,

                    notes:
                        document
                            .getElementById(
                                "shooting-notes"
                            ).value
                });

            this.emit(
                "shooting.saved",
                {
                    shotId:
                        this.selectedShot
                            .internalId
                }
            );
        }

        //--------------------------------
        // Complete
        //--------------------------------

        complete(){

            if(
                !this.selectedShot
            ){
                return;
            }

            this.selectedShot
                .setStatus(
                    "complete"
                );

            this.setProgress(
                100
            );

            this.emit(
                "shooting.completed",
                {
                    shotId:
                        this.selectedShot
                            .internalId
                }
            );
        }

        //--------------------------------
        // Events
        //--------------------------------

        bindEvents(){

            document
                .getElementById(
                    "add-take"
                )
                .onclick =
                    ()=>this.addTake();

            document
                .getElementById(
                    "shooting-save"
                )
                .onclick =
                    ()=>this.save();

            document
                .getElementById(
                    "shooting-complete"
                )
                .onclick =
                    ()=>this.complete();

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

                shotId:
                    this
                        .selectedShot
                        ?.internalId,

                takeList:
                    structuredClone(
                        this.takeList
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
                    "ShootingWorkspace"
                );
        }
    }

    global
        .AIDirector
        .WorkspaceUI
        .Shooting =
            new ShootingWorkspace();

})(window);
