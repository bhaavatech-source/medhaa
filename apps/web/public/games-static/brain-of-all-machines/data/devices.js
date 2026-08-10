const DevicesData = {
  calculator:{name:"Calculator", icon:"🧮", desc:"Performs quick arithmetic using a tiny dedicated chip.", chips:["mcu","memory_rom","display_driver"]},

  remote:{name:"Remote Control", icon:"📺", desc:"Sends infrared or radio signals to control another device.", chips:["mcu","memory_rom"]},

  phone:{name:"Smartphone", icon:"📱", desc:"A pocket supercomputer combining dozens of chip types working together.", chips:["cpu","gpu","npu","memory_ram","flash","sensor_ic","power_ic","wifi_chip","bluetooth_chip","gps_receiver","camera_isp","audio_codec","battery_mgmt_ic","security_chip","adc","dac"]},

  laptop:{name:"Laptop", icon:"💻", desc:"A portable computer balancing performance chips with power efficiency.", chips:["cpu","gpu","memory_ram","flash","wifi_chip","power_ic","display_driver","clock_generator","security_chip"]},

  desktop:{name:"Desktop Computer", icon:"🖥️", desc:"A high-performance machine with room for powerful, larger chips.", chips:["cpu","gpu","memory_ram","display_driver","clock_generator"]},

  router:{name:"Wi-Fi Router", icon:"📡", desc:"Directs internet data traffic between your devices and the world.", chips:["asic","wifi_chip","dsp","memory_ram"]},

  drone:{name:"Drone", icon:"🚁", desc:"A flying robot balancing sensing, control, and communication chips.", chips:["mcu","sensor_ic","motor_driver","gps_receiver","camera_isp","battery_mgmt_ic","npu"]},

  robot:{name:"Robot", icon:"🤖", desc:"Combines sensing, thinking, and moving chips to interact with the world.", chips:["cpu","mcu","motor_driver","sensor_ic","memory_ram","npu"]},

  medical_equipment:{name:"Medical Equipment", icon:"🏥", desc:"Life-critical devices requiring extremely precise and reliable chips.", chips:["mcu","adc","sensor_ic","display_driver"]},

  atm:{name:"ATM Machine", icon:"🏦", desc:"Handles secure transactions using dedicated security and control chips.", chips:["cpu","security_chip","display_driver","memory_ram"]},

  traffic_light:{name:"Traffic Light", icon:"🚦", desc:"Uses a simple but critical microcontroller to keep roads safe.", chips:["mcu","clock_generator"]},

  smart_watch:{name:"Smart Watch", icon:"⌚", desc:"A tiny wearable computer packed with sensing and communication chips.", chips:["mcu","sensor_ic","bluetooth_chip","battery_mgmt_ic","audio_codec","display_driver"]},

  factory_robot:{name:"Factory Robot Arm", icon:"🏭", desc:"An industrial machine requiring precise, powerful motor control.", chips:["cpu","motor_driver","sensor_ic","gpu"]},

  washing_machine:{name:"Washing Machine", icon:"🧺", desc:"Uses one dedicated microcontroller to run wash cycles reliably.", chips:["mcu","motor_driver","sensor_ic"]},

  microwave:{name:"Microwave Oven", icon:"🍽️", desc:"A simple appliance controlled by one small, reliable chip.", chips:["mcu","eeprom","display_driver"]},

  elevator:{name:"Elevator", icon:"🛗", desc:"Safety-critical machine controlled by dedicated microcontrollers.", chips:["mcu","sensor_ic","motor_driver"]},

  electric_vehicle:{name:"Electric Vehicle", icon:"🚗", desc:"A rolling computer network with over 100 chips managing power, safety, and driving.", chips:["cpu","mcu","battery_mgmt_ic","motor_driver","gps_receiver","sensor_ic","power_ic","npu"]},

  television:{name:"Television", icon:"📺", desc:"Turns digital signals into the moving pictures and sound you see.", chips:["cpu","display_driver","dac","audio_codec"]},

  camera:{name:"Digital Camera", icon:"📷", desc:"Captures and processes light into stored digital images.", chips:["camera_isp","flash","cpu"]},

  train:{name:"Train", icon:"🚆", desc:"Uses networked control chips to manage speed, brakes, and safety.", chips:["mcu","sensor_ic","gps_receiver","motor_driver"]},

  aircraft:{name:"Aircraft", icon:"✈️", desc:"Relies on redundant, highly reliable chips for flight-critical systems.", chips:["fpga","sensor_ic","gps_receiver","cpu"]},

  satellite:{name:"Satellite", icon:"🛰️", desc:"Operates in space using radiation-hardened, reprogrammable chips.", chips:["fpga","cpu","clock_generator","power_ic","wifi_chip"]},

  ai_server:{name:"AI Server", icon:"🖥️", desc:"A data-center machine built almost entirely around AI-focused chips.", chips:["tpu","gpu","cpu","memory_ram"]},
};