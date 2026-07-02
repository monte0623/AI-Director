/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-1
Release-006

File:
js/model/sequence.js

Architecture:
Sequence Domain

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

    //------------------------------------------------
    // Sequence Type
    //------------------------------------------------

    const SequenceType = {

        MOVIE      : "movie",
        TV         : "tv",
        COMMERCIAL : "commercial",
        MV         : "mv",
        YOUTUBE    : "youtube",
        INSTAGRAM  : "instagram",
        TIKTOK     : "tiktok",
        SHORTVIDEO : "shortvideo",
        CUSTOM     : "custom"
    };

    //------------------------------------------------
    // Sequence Status
    //------------------------------------------------

    const SequenceStatus = {

        DRAFT     : "draft",
        PLANNED   : "planned",
        READY     : "ready",
        EDITING   : "editing",
        COMPLETE  : "complete",
        ARCHIVED  : "archived"
    };

    //------------------------------------------------
    // Sequence
    //------------------------------------------------

    class Sequence extends DomainObject {

        constructor(
            internalId = "SEQ-" + Date.now(),
            displayId = "SEQ-001"
        ){

            super(
                internalId,
                displayId
            );

            //----------------------------------------
            // Basic
            //----------------------------------------

            this.sequenceName = "";

            this.sequenceType =
                SequenceType.CUSTOM;

            this.description = "";

            //----------------------------------------
            // Target
            //----------------------------------------

            this.targetPlatform = "";

            this.targetAspect = "";

            this.targetResolution = "";

            this.targetFPS = 24;

            //----------------------------------------
            // Version
            //----------------------------------------

            this.versionName = "";

            this.parentSequence = "";

            //----------------------------------------
            // Relations
            //----------------------------------------

            this.sceneRefs = [];

            this.shotRefs = [];

            //----------------------------------------
            // Output
            //----------------------------------------

            this.outputPath = "";

            this.exportPreset = "";

            //----------------------------------------
            // Notes
            //----------------------------------------

            this.notes = "";

            //----------------------------------------
            // Status
            //----------------------------------------

            this.status =
                SequenceStatus.DRAFT;

            //----------------------------------------
            // Workspace
            //----------------------------------------

            this.selected = false;

            this.expanded = false;
        }

        //----------------------------------------
        // Update
        //----------------------------------------

        updateSequence(
            data = {}
        ){

            this.update(data);

            this.emit(
                "sequence.updated",
                {
                    sequenceId:
                        this.internalId
                }
            );
        }

        //----------------------------------------
        // Scene
        //----------------------------------------

        addScene(
            sceneId
        ){

            if(
                !this.sceneRefs
                    .includes(sceneId)
            ){

                this.sceneRefs
                    .push(sceneId);

                this.updatedAt =
                    Date.now();

                this.emit(
                    "sequence.linked.scene",
                    {
                        sequenceId:
                            this.internalId,
                        sceneId
                    }
                );
            }
        }

        removeScene(
            sceneId
        ){

            this.sceneRefs =
                this.sceneRefs.filter(
                    id =>
                        id !== sceneId
                );

            this.updatedAt =
                Date.now();

            this.emit(
                "sequence.unlinked.scene",
                {
                    sequenceId:
                        this.internalId,
                    sceneId
                }
            );
        }

        //----------------------------------------
        // Shot
        //----------------------------------------

        addShot(
            shotId
        ){

            if(
                !this.shotRefs
                    .includes(shotId)
            ){

                this.shotRefs
                    .push(shotId);

                this.updatedAt =
                    Date.now();

                this.emit(
                    "sequence.linked.shot",
                    {
                        sequenceId:
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
                "sequence.unlinked.shot",
                {
                    sequenceId:
                        this.internalId,
                        shotId
                }
            );
        }

        //----------------------------------------
        // Reorder
        //----------------------------------------

        moveShot(
            fromIndex,
            toIndex
        ){

            if(
                fromIndex < 0 ||
                toIndex < 0 ||
                fromIndex >=
                    this.shotRefs.length ||
                toIndex >=
                    this.shotRefs.length
            ){
                return;
            }

            const item =
                this.shotRefs.splice(
                    fromIndex,
                    1
                )[0];

            this.shotRefs.splice(
                toIndex,
                0,
                item
            );

            this.emit(
                "sequence.updated",
                {
                    sequenceId:
                        this.internalId,
                    action:
                        "reorder"
                }
            );
        }

        //----------------------------------------
        // Status
        //----------------------------------------

        setStatus(
            status
        ){

            this.status =
                status;

            this.updatedAt =
                Date.now();

            this.emit(
                "sequence.updated",
                {
                    sequenceId:
                        this.internalId,
                    status
                }
            );
        }

        //----------------------------------------
        // Workspace
        //----------------------------------------

        select(){

            this.selected = true;

            this.emit(
                "sequence.selected",
                {
                    sequenceId:
                        this.internalId
                }
            );
        }

        unselect(){

            this.selected = false;

            this.emit(
                "sequence.unselected",
                {
                    sequenceId:
                        this.internalId
                }
            );
        }

        expand(){

            this.expanded = true;

            this.emit(
                "workspace.expand",
                {
                    sequenceId:
                        this.internalId
                }
            );
        }

        collapse(){

            this.expanded = false;

            this.emit(
                "workspace.collapse",
                {
                    sequenceId:
                        this.internalId
                }
            );
        }

        //----------------------------------------
        // Validation
        //----------------------------------------

        validate(){

            return (
                this.internalId &&
                this.displayId
            );
        }

        //----------------------------------------
        // Serialize
        //----------------------------------------

        serialize(){

            return {

                ...super.serialize(),

                sequenceName:
                    this.sequenceName,

                sequenceType:
                    this.sequenceType,

                description:
                    this.description,

                targetPlatform:
                    this.targetPlatform,

                targetAspect:
                    this.targetAspect,

                targetResolution:
                    this.targetResolution,

                targetFPS:
                    this.targetFPS,

                versionName:
                    this.versionName,

                parentSequence:
                    this.parentSequence,

                sceneRefs:
                    [...this.sceneRefs],

                shotRefs:
                    [...this.shotRefs],

                outputPath:
                    this.outputPath,

                exportPreset:
                    this.exportPreset,

                notes:
                    this.notes,

                status:
                    this.status
            };
        }
    }

    global
        .AIDirector
        .Model
        .Sequence =
        Sequence;

    global
        .AIDirector
        .Model
        .SequenceType =
        SequenceType;

    global
        .AIDirector
        .Model
        .SequenceStatus =
        SequenceStatus;

})(window);
