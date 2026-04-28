async function checkers() {
    if (!/^\/ucp\/\d+$/.test(location.pathname)) return;

    // Base Checkers
    hideApproveSubmitIfTooFast();
    initTemplateWatcher();
    checkCreateLimit();
    checkOtherAccounts();

    // OOC Checkers
    checkAccountNickname();
    checkAccountEmail();
    checkAccountIPBan();
    await getFirstPlayerRegDate();

    // IC Checkers
    checkCharacterName();
    checkCharacterNation();
    watchSkinImages();
    processQuenta();

    renderAuditWidget();
    CustomTemplateWatcher();
    initStatusLogger();
}

async function bootstrap() {
    const ok = await initApp();
    if (!ok) return;

    await checkers();
    startObserver(checkers);
}

bootstrap();