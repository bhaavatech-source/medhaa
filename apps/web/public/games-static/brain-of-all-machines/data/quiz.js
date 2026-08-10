const QuizData = [
  {
    q: "Which chip acts as the general decision-maker of most computers?",
    options: ["GPU", "CPU", "DAC", "ROM"],
    answer: 1,
    explain:
      "The CPU fetches, decodes, and executes instructions. It coordinates the rest of the system."
  },

  {
    q: "Which chip is best at doing thousands of similar calculations at the same time?",
    options: ["CPU", "MCU", "GPU", "EEPROM"],
    answer: 2,
    explain:
      "A GPU contains many small processing cores for parallel work, making it useful for graphics and AI math."
  },

  {
    q: "Which memory type loses its data when power is switched off?",
    options: ["ROM", "RAM", "Flash", "EEPROM"],
    answer: 1,
    explain:
      "RAM is fast temporary memory. It is volatile, which means it needs electricity to keep its data."
  },

  {
    q: "What does an ADC do?",
    options: [
      "Converts digital signals to analog",
      "Converts analog signals to digital",
      "Stores data permanently",
      "Controls motors"
    ],
    answer: 1,
    explain:
      "An Analog-to-Digital Converter changes a real-world signal, such as sound or light, into digital numbers."
  },

  {
    q: "Which chip type can be reconfigured after it is manufactured?",
    options: ["ASIC", "FPGA", "ROM", "DAC"],
    answer: 1,
    explain:
      "An FPGA contains programmable logic blocks. Engineers can configure those blocks to form different digital circuits."
  },

  {
    q: "Why does a modern phone use an NPU for some AI tasks?",
    options: [
      "It makes the phone screen larger",
      "It runs neural-network math more efficiently",
      "It permanently stores photos",
      "It replaces every other chip"
    ],
    answer: 1,
    explain:
      "An NPU is designed for neural-network calculations. It can run AI features while using less power than a general CPU."
  },

  {
    q: "What is the primary purpose of a Battery Management IC?",
    options: [
      "Increase screen brightness",
      "Play music",
      "Keep a battery safe and efficient",
      "Connect to Wi-Fi"
    ],
    answer: 2,
    explain:
      "A battery-management chip checks voltage, current, and temperature to reduce the risk of unsafe charging, overheating, or over-discharge."
  },

  {
    q: "Which invention made it practical to put many transistors on one tiny piece of silicon?",
    options: [
      "Abacus",
      "Vacuum tube",
      "Integrated circuit",
      "Internet"
    ],
    answer: 2,
    explain:
      "The integrated circuit combined multiple electronic components on one silicon chip. This led directly to the microprocessor."
  },

  {
    q: "A robot must read a distance sensor and turn a motor. Which pair is most important?",
    options: [
      "ROM and Flash",
      "Sensor IC and Motor Driver",
      "GPU and Display Driver",
      "TPU and DAC"
    ],
    answer: 1,
    explain:
      "The sensor IC turns physical information into data, while the motor driver provides controlled power to the motor."
  },

  {
    q: "Why is an ASIC not ideal when engineers are still experimenting with a design?",
    options: [
      "It cannot use electricity",
      "It is permanently built for one specific function",
      "It is too small",
      "It has no transistors"
    ],
    answer: 1,
    explain:
      "An ASIC is extremely efficient for one final task, but its physical circuitry cannot be changed after manufacturing."
  }
];