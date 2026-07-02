/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-4
Release-003

File:
js/mobile/ratio-engine.js

Architecture:
Mobile Ratio Engine

Depends:
event-bus.js
progressive-engine.js
snap-engine.js
workspace-state.js

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    if(!global.AIDirector){
        global.AIDirector = {};
    }

    if(!global.AIDirector.Mobile){
        global.AIDirector.Mobile = {};
    }

    class MobileRatioEngine {

        constructor(){

            //----------------------------------------
            // Ratio Presets
            //----------------------------------------

            this.presets = {

                equal : {
                    top:50,
                    bottom:50
                },

                topLarge : {
                    top:60,
                    bottom:40
                },

                bottomLarge : {
                    top:40,
                    bottom:60
                },

                topFocus : {
                    top:70,
                    bottom:30
                },

                bottomFocus : {
                    top:30,
                    bottom:70
                }
            };

            //----------------------------------------
            // Current
            //----------------------------------------

            this.current = {

                top:50,
                bottom:50
            };

            //----------------------------------------
            // Adaptive Rules
            //----------------------------------------

            this.rules = {

                script : {
                    top:40,
                    bottom:60
                },

                scene : {
                    top:45,
                    bottom:55
                },

                shot : {
                    top:50,
                    bottom:50
                },

                detail : {
                    top:60,
                    bottom:40
                },

                storyboard : {
                    top:65,
                    bottom:35
                },

                shooting : {
                    top:50,
                    bottom:50
                }
            };

            //----------------------------------------
            // Containers
            //----------------------------------------

            this.top = null;

            this.bottom = null;
        }

        //----------------------------------------
        // Initialize
        //----------------------------------------

        initialize(){

            this.top =
                document.getElementById(
                    "mobile-top"
                );

            this.bottom =
                document.getElementById(
                    "mobile-bottom"
                );

            this.bindEvents();

            this.load();

            this.emit(
                "mobile.ratio.initialized"
            );
        }

        //----------------------------------------
        // Set Ratio
        //----------------------------------------

        setRatio(
            top,
            bottom
        ){

            if(
                top + bottom !==
                100
            ){
                return;
            }

            this.current = {
                top,
                bottom
            };

            this.apply();

            this.emit(
                "mobile.ratio.changed",
                {
                    top,
                    bottom
                }
            );
        }

        //----------------------------------------
        // Preset
        //----------------------------------------

        usePreset(
            preset
        ){

            if(
                !this.presets[
                    preset
                ]
            ){
                return;
            }

            const p =
                this.presets[
                    preset
                ];

            this.setRatio(
                p.top,
                p.bottom
            );

            this.emit(
                "mobile.ratio.preset",
                {
                    preset
                }
            );
        }

        //----------------------------------------
        // Adaptive
        //----------------------------------------

        adapt(
            workspace
        ){

            const rule =
                this.rules[
                    workspace
                ];

            if(
                !rule
            ){
                return;
            }

            this.setRatio(
                rule.top,
                rule.bottom
            );

            this.emit(
                "mobile.ratio.adapt",
                {
                    workspace
                }
            );
        }

        //----------------------------------------
        // Apply
        //----------------------------------------

        apply(){

            if(
                !this.top ||
                !this.bottom
            ){
                return;
            }

            this.top.style.height =
                this.current.top
                + "vh";

            this.bottom.style.height =
                this.current.bottom
                + "vh";

            this.save();
        }

        //----------------------------------------
        // Equal
        //----------------------------------------

        equal(){

            this.usePreset(
                "equal"
            );
        }

        //----------------------------------------
        // Focus Top
        //----------------------------------------

        focusTop(){

            this.usePreset(
                "topFocus"
            );
        }

        //----------------------------------------
        // Focus Bottom
        //----------------------------------------

        focusBottom(){

            this.usePreset(
                "bottomFocus"
            );
        }

        //----------------------------------------
        // Save
        //----------------------------------------

        save(){

            localStorage
                .setItem(
                    "AI_DIRECTOR_MOBILE_RATIO",
                    JSON.stringify(
                        this.current
                    )
                );

            this.emit(
                "mobile.ratio.saved"
            );
        }

        //----------------------------------------
        // Load
        //----------------------------------------

        load(){

            const data =
                localStorage
                    .getItem(
                        "AI_DIRECTOR_MOBILE_RATIO"
                    );

            if(
                !data
            ){
                return;
            }

            this.current =
                JSON.parse(
                    data
                );

            this.apply();

            this.emit(
                "mobile.ratio.loaded"
            );
        }

        //----------------------------------------
        // Snapshot
        //----------------------------------------

        snapshot(){

            return {

                timestamp:
                    Date.now(),

                ratio:
                    structuredClone(
                        this.current
                    )
            };
        }

        //----------------------------------------
        // Restore
        //----------------------------------------

        restore(
            snapshot
        ){

            this.current =
                structuredClone(
                    snapshot
                        .ratio
                );

            this.apply();

            this.emit(
                "mobile.ratio.restored"
            );
        }

        //----------------------------------------
        // Event Binding
        //----------------------------------------

        bindEvents(){

            global
                .AIDirector
                .EventBus
                .on(
                    "mobile.stage.changed",
                    e => {

                        if(
                            e.payload
                                .bottom
                        ){

                            this.adapt(
                                e.payload
                                    .bottom
                            );
                        }
                    }
                );

            global
                .AIDirector
                .EventBus
                .on(
                    "mobile.snap.begin",
                    ()=>{

                        this.focusBottom();
                    }
                );

            global
                .AIDirector
                .EventBus
                .on(
                    "mobile.snap.complete",
                    ()=>{

                        this.equal();
                    }
                );
        }

        //----------------------------------------
        // EventBus
        //----------------------------------------

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
                    "MobileRatio"
                );
        }
    }

    global
        .AIDirector
        .Mobile
        .Ratio =
            new MobileRatioEngine();

})(window);
