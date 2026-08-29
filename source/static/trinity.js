const heresyDatabase = {
  water: {
    label: "God is like water (Ice, Liquid, Steam)",
    title: "Modalism (Sabellianism)",
    desc: "Claiming God is one single person who manifests in three different sequential modes or states (like water as ice, liquid, and steam).",
    logic:
      "Logical Failure: A single quantity of water cannot simultaneously exist as 100% ice, liquid, and steam in the exact same state. It reduces the three Persons to mere temporary roles, rendering Jesus' prayers to the Father logically absurd (God talking to Himself).",
    targetNodes: ["node-god", "node-father", "node-son", "node-spirit"],
  },
  person: {
    label: "God is like a man who is a Father, Husband, and Worker",
    title: "Modalism (Role-Based)",
    desc: "Claiming God is like one man acting as a Father, Husband, and Employee simultaneously.",
    logic:
      "Logical Failure: A single man holds three roles, but there remains only one conscious mind. This collapses the Trinity into a single Person wearing three different masks.",
    targetNodes: ["node-god"],
  },
  clover: {
    label: "God is like a 3-leaf clover (3 leaves, 1 plant)",
    title: "Partialism",
    desc: "Claiming the Father, Son, and Spirit are three parts that together form one complete God (like three leaves on a clover).",
    logic:
      "Logical Failure: One leaf of a clover is only 33% of the clover. Trinitarian orthodoxy requires that each Person is 100% fully God on their own, not a fractional part of a composite God.",
    targetNodes: ["node-father", "node-son", "node-spirit"],
  },
  egg: {
    label: "God is like an egg (Yolk, White, Shell)",
    title: "Partialism / Subordinate Composition",
    desc: "Claiming God is like an egg composed of yolk, white, and shell.",
    logic:
      "Logical Failure: An egg yolk is not an egg white, nor is the yolk 'fully the egg' by itself. Dividing divine substance into components violates divine simplicity.",
    targetNodes: ["node-father", "node-son", "node-spirit"],
  },
  sun: {
    label: "God is like the Sun (Star, Light, Heat)",
    title: "Arianism / Emanationism",
    desc: "Claiming the Father is God (the Sun), while the Son and Spirit are secondary emissions (Light and Heat).",
    logic:
      "Logical Failure: Light and heat are properties radiated by the Sun; they are not the Sun itself. This denies the co-equal divinity and self-existence of the Son and Spirit.",
    targetNodes: ["node-father", "node-son"],
  },
  creation: {
    label: "Jesus was God's first and greatest creation",
    title: "Arianism",
    desc: "Claiming that Jesus was the first and highest created entity made by God.",
    logic:
      "Logical Failure: If the Son was created, there was a point in time when He did not exist. This breaks co-eternality and reduces Christ from God the Creator to a created being.",
    targetNodes: ["node-son"],
  },
  gods: {
    label: "They are three distinct gods who act in total harmony",
    title: "Tritheism",
    desc: "Claiming that the Father, Son, and Spirit are three distinct individual gods who share a common goal.",
    logic:
      "Logical Failure: This abandons monotheism entirely in favor of polytheism. It asserts three separate divine substances (1 + 1 + 1 = 3), directly contradicting unity of substance.",
    targetNodes: ["node-father", "node-son", "node-spirit"],
  },
  phantom: {
    label: "Jesus was purely divine and only appeared to be human",
    title: "Docetism",
    desc: "Claiming Jesus was purely divine and only pretended or appeared to have a physical human body.",
    logic:
      "Logical Failure: Denies the reality of Christ's humanity. If the human experience was a phantasm, it undermines the incarnation and bodily atonement.",
    targetNodes: ["node-son"],
  },
  flesh_only: {
    label: "Jesus was just a human endowed with divine power at baptism",
    title: "Adoptionism (Dynamic Monarchianism)",
    desc: "Claiming Jesus was born an ordinary mortal man and was 'adopted' as God's Son at his baptism due to his sinless life.",
    logic:
      "Logical Failure: Strips the Son of eternal divine existence. It makes divinity a reward bestowed on a human rather than an eternal attribute of God.",
    targetNodes: ["node-son"],
  },
  two_persons: {
    label: "Jesus was two separate people sharing a body",
    title: "Nestorianism",
    desc: "Claiming Jesus existed as two completely separate persons (one human, one divine) residing inside one body.",
    logic:
      "Logical Failure: Splits Christ into two distinct subjects of consciousness, destroying the unity of the Incarnate Person.",
    targetNodes: ["node-son"],
  },
  mind_body: {
    label: "Jesus had a human body, but his mind was purely divine",
    title: "Apollinarianism",
    desc: "Claiming Jesus had a human physical body, but a divine mind instead of a human soul/mind.",
    logic:
      "Logical Failure: Asserts that Christ was not fully human. Early theologians noted: 'What is not assumed is not redeemed'—if He lacked a human mind, human minds remain unredeemed.",
    targetNodes: ["node-son"],
  },
  blend: {
    label:
      "Jesus' divine and human natures merged into a brand-new hybrid nature",
    title: "Monophysitism (Eutychianism)",
    desc: "Claiming Christ's human and divine natures dissolved together to form a brand-new third nature (like drops of ink in water).",
    logic:
      "Logical Failure: Creates a hybrid entity that is neither fully human nor fully God, failing both divine and human requirements simultaneously.",
    targetNodes: ["node-son", "node-god"],
  },
  dimensional: {
    label:
      "Father, Son, and Holy Spirit are projections of a higher-dimentional being",
    title: "Modalism (Dimensional Projectionism)",
    desc: "Claiming God is a single higher-dimensional entity whose Father, Son, and Spirit aspects are merely lower-dimensional projections or geometric shadows cast onto a three-dimensional framework.",
    logic:
      "Logical Failure: Category Mistake (Fallacy of Division / Equating Persons with Dimensions). It treats distinct conscious subjects (persons who love, speak, and relate to one another) as if they were spatial axes or geometric coordinates. This collapses the Trinity back into a single solitary mind wearing different structural projections, making relational interaction (like the Son praying to the Father) an illusion.",
    targetNodes: ["node-god", "node-father", "node-son", "node-spirit"],
  },
};
