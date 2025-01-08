const DIVIDER_HEIGHT = 10;

class RouteHeader {
  static readonly template = document.getElementById(
    "route-header-template"
  ) as HTMLTemplateElement;
  static readonly HAS_ROUTE_HEIGHT = 147;
  static readonly NO_ROUTE_HEIGHT = 207;
  #container: SVGSVGElement;
  #routeName: SVGTextElement;

  constructor() {
    const container = RouteHeader.template.content.cloneNode(
      true
    ) as SVGSVGElement;
    this.#container = container;
    this.#routeName = container.querySelector("#route-name") as SVGTextElement;
  }

  mount(root: SVGElement) {
    root.appendChild(this.#container);
  }

  get routeName(): string {
    return this.#routeName.textContent ?? "";
  }
  set routeName(value: string) {
    this.#routeName.textContent = value;
    if (value == null) {
      this.#container.x.baseVal.value =
        RouteHeader.NO_ROUTE_HEIGHT + DIVIDER_HEIGHT;
      this.#container.classList.add("no-route");
    } else {
      this.#container.x.baseVal.value =
        RouteHeader.HAS_ROUTE_HEIGHT + DIVIDER_HEIGHT;
      this.#container.classList.remove("no-route");
    }
  }
}

const testSections = [
  {
    destinations: [{ text: ["Destination I"] }],
  },
  {
    destinations: [{ text: ["Destination II"] }, { text: ["Destination III"] }],
  },
  {
    destinations: [
      {
        text: ["Destination IV", "Sŋéqə ʔéʔləŋ", "via three lines"],
        subtext: true,
      },
    ],
  },
];

class DecisionSection {
  static readonly template = document.getElementById(
    "decision-section-template"
  ) as HTMLTemplateElement;
  #container: SVGGElement;
  destinations: (typeof testSections)[0][];

  constructor() {}

  mount(root: SVGElement) {
    const container = DecisionSection.template.content.cloneNode(
      true
    ) as SVGSVGElement;
    this.#container = container;
    root.appendChild(container);
  }

  addDestination(destination: (typeof this.destinations)[0]) {
    const textElem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
  }


}

class DecisionSign extends HTMLElement {
  static readonly template = document.getElementById(
    "decision-sign-template"
  ) as HTMLTemplateElement;
  static readonly HAS_ROUTE_HEIGHT = 147;
  static readonly NO_ROUTE_HEIGHT = 207;
  static readonly MAX_SECTIONS = 3;
  #container: SVGSVGElement;
  #sectionContainer: SVGSVGElement;
  header: RouteHeader;
  sections: DecisionSection[] = [];

  constructor() {
    super();
    const container = DecisionSign.template.content.cloneNode(
      true
    ) as SVGSVGElement;
    this.#container = container;
    this.#sectionContainer = container.querySelector(
      "#sections"
    ) as SVGSVGElement;
    this.header = new RouteHeader();
  }

  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(this.#container);
    this.header.mount(this.#sectionContainer);
    for (const section of testSections) {
      this.addSection();
    }
  }

  addSection() {
    if (this.sections.length >= DecisionSign.MAX_SECTIONS) {
      throw new Error("Cannot add more than 3 sections");
    }
    const section = new DecisionSection();
    this.sections.push(section);
    section.mount(this.#sectionContainer);
  }

  // get routeName(): string {
  //   return this.#routeName.textContent ?? "";
  // }
  // set routeName(value: string) {
  //   this.#routeName.textContent = value;
  //   if (value == null) {
  //     this.#container.x.baseVal.value =
  //       RouteHeader.NO_ROUTE_HEIGHT + DIVIDER_HEIGHT;
  //     this.#container.classList.add("no-route");
  //   } else {
  //     this.#container.x.baseVal.value =
  //       RouteHeader.HAS_ROUTE_HEIGHT + DIVIDER_HEIGHT;
  //     this.#container.classList.remove("no-route");
  //   }
  // }
}

customElements.define("decision-sign", DecisionSign);
