/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-1
Release-004

File:
js/model/scene.js

Architecture:
Scene Domain

Depends:
domain-base.js
event-bus.js

Status:
Foundation Stable
========================================================
*/

(function(global){

    "use strict";

    if(!global.AIDirector){
        global.AIDirector = {};
    }

    if(!global.AIDirector.Model){
        global.AIDirector.Model = {};
    }

    const DomainObject =
        global.AIDirector
            .Model
            .DomainObject;

    const SceneStatus = {

        DRAFT      : "draft",
        PLANNED    : "planned",
        READY      : "ready",
        SHOOTING   : "shooting",
        COMPLETED  : "completed",
        ARCHIVED   : "archived"
    };

    class Scene extends DomainObject {

        constructor(
            internalId = "SCN-" + Date.now(),
            displayId = "S00"
        ){

            super(
                internalId,
                displayId
            );

            //------------------------------------------------
            // Basic
            //------------------------------------------------

            this.sceneNo = "";

            this.sceneName = "";

            this.sceneDescription = "";

            //------------------------------------------------
            // Location
            //------------------------------------------------

            this.location = "";

            this.time = "";

            this.dayNight = "";

            //------------------------------------------------
            // Cast
            //------------------------------------------------

            this.actors = [];

            this.extras = [];

            //------------------------------------------------
            // Production
            //------------------------------------------------

            this.props = [];

            this.costumes = [];

            this.audio = "";

            this.lighting = "";

            this.effects = "";

            this.art = "";

            //------------------------------------------------
            // Notes
            //------------------------------------------------

            this.notes = "";

            //------------------------------------------------
            // Status
            //------------------------------------------------

            this.status =
                SceneStatus.DRAFT;

            //------------------------------------------------
            // Relations
            //------------------------------------------------

            this.shotRefs = [];

            this.sequenceRefs = [];

            //------------------------------------------------
            // Workspace
            //------------------------------------------------

            this.expanded = false;

            this.selected = false;
        }

        //------------------------------------------------
        // Scene Info
        //------------------------------------------------

        updateScene(
            data = {}
        ){

            this.update(data);

            this.emit(
                "scene.updated",
                {
                    sceneId:
                        this.internalId
                }
            );
        }

        //------------------------------------------------
        // Shot
        //------------------------------------------------

        addShot(
            shotId
        ){

            if(
                !this.shotRefs.includes(
                    shotId
                )
            ){

                this.shotRefs.push(
                    shotId
                );

                this.updatedAt =
                    Date.now();

                this.emit(
                    "scene.linked.shot",
                    {
                        sceneId:
                            this.internalId,

                        shotId
                    }
                );
            }
        }

        removeShot(
            shotId
        ){

            this.shotRefs =
                this.shotRefs.filter(
                    id =>
                        id !== shotId
                );

            this.updatedAt =
                Date.now();

            this.emit(
                "scene.unlinked.shot",
                {
                    sceneId:
                        this.internalId,

                    shotId
                }
            );
        }

        //------------------------------------------------
        // Sequence
        //------------------------------------------------

        addSequence(
            sequenceId
        ){

            if(
                !this.sequenceRefs
                    .includes(
                        sequenceId
                    )
            ){

                this.sequenceRefs
                    .push(
                        sequenceId
                    );

                this.updatedAt =
                    Date.now();

                this.emit(
                    "scene.linked.sequence",
                    {
                        sceneId:
                            this.internalId,

                        sequenceId
                    }
                );
            }
        }

        removeSequence(
            sequenceId
        ){

            this.sequenceRefs =
                this.sequenceRefs
                    .filter(
                        id =>
                            id !==
                            sequenceId
                    );

            this.updatedAt =
                Date.now();

            this.emit(
                "scene.unlinked.sequence",
                {
                    sceneId:
                        this.internalId,

                    sequenceId
                }
            );
        }

        //------------------------------------------------
        // Actor
        //------------------------------------------------

        addActor(
            actor
        ){

            if(
                !this.actors.includes(
                    actor
                )
            ){

                this.actors.push(
                    actor
                );

                this.emit(
                    "scene.updated",
                    {
                        sceneId:
                            this.internalId
                    }
                );
            }
        }

        removeActor(
            actor
        ){

            this.actors =
                this.actors.filter(
                    a =>
                        a !== actor
                );

            this.emit(
                "scene.updated",
                {
                    sceneId:
                        this.internalId
                }
            );
        }

        //------------------------------------------------
        // Props
        //------------------------------------------------

        addProp(
            prop
        ){

            if(
                !this.props.includes(
                    prop
                )
            ){

                this.props.push(
                    prop
                );

                this.emit(
                    "scene.updated",
                    {
                        sceneId:
                            this.internalId
                    }
                );
            }
        }

        removeProp(
            prop
        ){

            this.props =
                this.props.filter(
                    p =>
                        p !== prop
                );

            this.emit(
                "scene.updated",
                {
                    sceneId:
                        this.internalId
                }
            );
        }

        //------------------------------------------------
        // Status
        //------------------------------------------------

        setStatus(
            status
        ){

            this.status =
                status;

            this.updatedAt =
                Date.now();

            this.emit(
                "scene.updated",
                {
                    sceneId:
                        this.internalId,

                    status
                }
            );
        }

        //------------------------------------------------
        // Workspace
        //------------------------------------------------

        select(){

            this.selected = true;

            this.emit(
                "scene.selected",
                {
                    sceneId:
                        this.internalId
                }
            );
        }

        unselect(){

            this.selected = false;

            this.emit(
                "scene.unselected",
                {
                    sceneId:
                        this.internalId
                }
            );
        }

        expand(){

            this.expanded = true;

            this.emit(
                "workspace.expand",
                {
                    sceneId:
                        this.internalId
                }
            );
        }

        collapse(){

            this.expanded = false;

            this.emit(
                "workspace.collapse",
                {
                    sceneId:
                        this.internalId
                }
            );
        }

        //------------------------------------------------
        // Validation
        //------------------------------------------------

        validate(){

            return (
                this.internalId &&
                this.displayId
            );
        }

        //------------------------------------------------
        // Serialize
        //------------------------------------------------

        serialize(){

            return {

                ...super.serialize(),

                sceneNo:
                    this.sceneNo,

                sceneName:
                    this.sceneName,

                sceneDescription:
                    this.sceneDescription,

                location:
                    this.location,

                time:
                    this.time,

                dayNight:
                    this.dayNight,

                actors:
                    [...this.actors],

                extras:
                    [...this.extras],

                props:
                    [...this.props],

                costumes:
                    [...this.costumes],

                audio:
                    this.audio,

                lighting:
                    this.lighting,

                effects:
                    this.effects,

                art:
                    this.art,

                notes:
                    this.notes,

                status:
                    this.status,

                shotRefs:
                    [...this.shotRefs],

                sequenceRefs:
                    [...this.sequenceRefs]
            };
        }
    }

    global
        .AIDirector
        .Model
        .Scene =
        Scene;

    global
        .AIDirector
        .Model
        .SceneStatus =
        SceneStatus;

})(window);
