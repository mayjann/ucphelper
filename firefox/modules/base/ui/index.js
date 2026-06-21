import * as Core from "./core.js";
import * as Modal from "./modal.js";
import * as Widget from "./widget.js";
import * as Loader from "./loader.js";
import * as CopyButton from "./requestsCopyButton.js"
import * as Toast from "./toast.js"

export class UI {
    static createBadge = Core.createBadge;
    static createGoogleLink = Core.createGoogleLink;
    static createNewRequestButton = Core.createNewRequestButton;
    static applyRowState = Core.applyRowState;
    static showBanPopup = Core.showBanPopup;
    static createModalBadge = Modal.createModalBadge;
    static renderAuditWidget = Widget.renderAuditWidget;
    static refreshAuditWidget = Widget.refreshAuditWidget;
    static showLoader = Loader.showLoader;
    static hideLoader = Loader.hideLoader;
    static makeLcClickable = CopyButton.makeLcClickable;
    static showToast = Toast.showToast
}
