export default function setUpJs() {
    const point = window.innerHeight - 150;
    const html = document.querySelector("html");
    const header = document.querySelector("header");
    let sections = document.querySelectorAll("main .section");
    let offElements = document.querySelectorAll("main .off");
    const onTab = (event) => {
        const tab = event.currentTarget.closest(".section").getAttribute("tab");
        const relevantSections = document.querySelectorAll(`main .section[tab='${tab}']`);
        const index = Number(event.currentTarget.getAttribute("tabIndex")) - 1;
        relevantSections.forEach(el => el.classList.remove("active"));
        relevantSections[index].classList.add("active");
    };
    const moveScroll = () => {
        const top = window.pageYOffset;
        if (header != null) {
            header.classList.toggle("view", top > 0);
        }
        sections.forEach((section) => {
            if (top > section.offsetTop - 400) {
                section.classList.add("view");
                html.setAttribute("index", section.getAttribute("id"));
            } else {
                section.classList.remove("view");
            }
        });
        offElements.forEach((offElement) => {
            const pos = getPosition(offElement);
            offElement.classList.toggle("on", top > (pos.top - point));
            offElement.classList.toggle("off", top <= (pos.top - point));
        });
    };
    const getPosition = (el) => {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    };
    const handleScroll = () => {
        moveScroll();
    };
    const handleResize = () => {
        sections = document.querySelectorAll("main .section");
        offElements = document.querySelectorAll("main .off");
        moveScroll();
    };
    // 초기 데이터 설정
    moveScroll();
    // 이벤트 리스너 설정
    document.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    // Cleanup
    return () => {
        document.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
    };
}