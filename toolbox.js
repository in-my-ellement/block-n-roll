const Blockly = require("blockly");
const { pythonGenerator } = require("blockly/python");

// https://developers.google.com/blockly/guides/configure/web/custom-blocks

/* events */
Blockly.Blocks["robot_init"] = {
    init: function() {
        // event block: no previous statement
        this.setPreviousStatement(false);
        this.setNextStatement(false);

        this.appendDummyInput()
            .appendField("Robot Init");

        this.appendStatementInput("DO");

        // code generation
        pythonGenerator["robot_init"] = function(block) {
            // generate code from statement input
            const statements = pythonGenerator.statementToCode(block, "DO");

            // function header and autogenerated code
            var code = "def robotInit(self):\n";
            code += "  # autogenerated code\n";
            code += statements;

            return code;
        }
    }
}

Blockly.Blocks["robot_periodic"] = {
    init: function() {
        // event block
        this.setPreviousStatement(false);
        this.setNextStatement(false);

        this.appendDummyInput()
            .appendField("Robot Periodic");

        this.appendStatementInput("DO");

        pythonGenerator["robot_periodic"] = function(block) {
            // generate code from statement input
            const statements = pythonGenerator.statementToCode(block, "DO");
            
            var code = "def robotPeriodic(self):\n";
            code += "  # autogenerated code\n";
            code += statements;

            return code;
        }
    }
}

/* motors */
Blockly.Blocks["init_can_motor"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("Init motor on CAN ")
            .appendField(new Blockly.FieldNumber(1, 1, 30, 1), "CAN_ID")
            .appendField(" to type ")
            .appendField(new Blockly.FieldDropdown([
                ["Spark Max", "SPARK"],
                ["Falcon 500", "FALCON"],
                ["Talon SRX", "TALON"],
                ["Victor SPX", "VICTOR"]
            ]), "TYPE");

        pythonGenerator["init_can_motor"] = function(block) {
            const can = block.getFieldValue("CAN_ID");
            var instantiation = `self.motor_can_${can} = `;

            switch (block.getFieldValue("TYPE")) {
                case "SPARK":
                case "FALCON":
                case "TALON":
                case "VICTOR": 
                default: 
                    instantiation += "None";
                    break;
            }

            instantiation += "\n";
            return instantiation;
        }
    }
}

Blockly.Blocks["init_pwm_motor"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("Init motor on PWM ")
            .appendField(new Blockly.FieldNumber(1, 1, 30, 1), "PWM_PORT")
            .appendField(" to type ")
            .appendField(new Blockly.FieldDropdown([
                ["Spark", "SPARK"],
                ["Talon SRX", "TALON"],
                ["Jaguar", "JAGUAR"]
            ]), "TYPE");

        pythonGenerator["init_pwm_motor"] = function(block) {
            const pwm = block.getFieldValue("PWM_PORT");
            var instantiation = `self.motor_pwm_${pwm} = `;

            switch (block.getFieldValue("TYPE")) {
                case "SPARK":
                    instantiation += `wpilib.Spark(${pwm})`;
                    break;
                case "TALON":
                    instantiation += `wpilib.Talon(${pwm})`;
                    break;
                case "JAGUAR":
                    instantiation += `wpilib.Jaguar(${pwm})`;
                    break;
                default:
                    console.log("unimplemented");
                    instantiation += "None";
                    break;
            }

            instantiation += "\n";
            return instantiation;
        }
    }
}

Blockly.Blocks["set_pwm"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("Set PWM ")
            .appendField(new Blockly.FieldNumber(1, 1, 30, 1), "ID")
            .appendField(" to ")
            .appendField(new Blockly.FieldNumber(0.0, -1.0, 1.0, 0.01), "VALUE");

        pythonGenerator["set_pwm"] = function(block) {
            const id = block.getFieldValue("ID");
            const value = block.getFieldValue("VALUE");

            return `self.motor_pwm_${id}.set(${value})`;
        }
    }
}

/* sensors */
Blockly.Blocks["init_gyro"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("Init gyro of type ")
            .appendField(new Blockly.FieldDropdown([
                ["NavX", "NAVX"]
                // TODO: more types
            ]), "TYPE");

        pythonGenerator["init_gyro"] = function(block) {
            var instantiation = `self.gyro_${block.getFieldValue("TYPE").toLowerCase()} = `

            switch (block.getFieldValue("TYPE")) {
                default:
                    console.log("unimplemented");
                    instantiation += "None";
                    break;
            }

            instantiation += "\n";
            return instantiation;
        }
    }
}

Blockly.Blocks["get_gyro_angle"] = {
    init: function() {
        this.setOutput(true, "Number");

        this.appendDummyInput()
            .appendField("Gyro angle from ")
            .appendField(new Blockly.FieldDropdown([
                ["NavX", "NAVX"]
            ]));

        pythonGenerator["get_gyro_angle"] = function(block) {
            var code = "self.gyro_navx.get()";
            return [code, pythonGenerator.ORDER_FUNCTION_CALL];
        }
    }
}

/* controllers */
Blockly.Blocks["get_raw_axis"] = {
    init: function() {
        this.setOutput(true, "Number");

        this.appendDummyInput()
            .appendField("Get value of joystick ")
            .appendField(new Blockly.FieldNumber(0, 0, 10, 1), "PORT")
            .appendField(" axis ")
            .appendField(new Blockly.FieldNumber(1, 1, 10, 1), "AXIS");

        pythonGenerator["get_raw_axis"] = function(block) {
            return ["RAW_AXIS", pythonGenerator.ORDER_FUNCTION_CALL];
        }
    }
}

Blockly.Blocks["while_btn_held"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("While button ")
            .appendField(new Blockly.FieldNumber(0, 0, 20, 1), "BTN")
            .appendField(" on joystick ")
            .appendField(new Blockly.FieldNumber(0, 0, 10, 1), "PORT")
            .appendField(" is held")

        this.appendStatementInput("DO");

        pythonGenerator["while_btn_held"] = function(block) {
            return ["BTN_HOLD", null];
        }
    }
}

Blockly.Blocks["when_btn_pressed"] = {
    init: function() {
        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.appendDummyInput()
            .appendField("When button ")
            .appendField(new Blockly.FieldNumber(0, 0, 20, 1), "BTN")
            .appendField(" on joystick ")
            .appendField(new Blockly.FieldNumber(0, 0, 10, 1), "PORT")
            .appendField(" is pressed")

        this.appendStatementInput("DO");

        pythonGenerator["when_btn_pressed"] = function(block) {
            return ["BTN_PRESS", null];
        }
    }
}

/* commands */

// https://developers.google.com/blockly/guides/configure/web/toolbox
module.exports = {
    "kind": "categoryToolbox",
    "contents": [
        {
            "kind": "category",
            "name": "Events",
            "contents": [
                {
                    "type": "robot_init",
                    "kind": "block"
                },
                {
                    "type": "robot_periodic",
                    "kind": "block"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Logic",
            "contents": [
                {
                    "type": "controls_if",
                    "kind": "block"
                },
                {
                    "type": "logic_compare",
                    "kind": "block",
                    "fields": {
                        "OP": "EQ"
                    }
                },
                {
                    "type": "logic_operation",
                    "kind": "block",
                    "fields": {
                        "OP": "AND"
                    }
                },
                {
                    "type": "logic_negate",
                    "kind": "block"
                },
                {
                    "type": "logic_boolean",
                    "kind": "block",
                    "fields": {
                        "BOOL": "TRUE"
                    }
                },
                {
                    "type": "logic_ternary",
                    "kind": "block"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Math",
            "contents": []
        },
        {
            "kind": "category",
            "name": "Motors",
            "contents": [
                {
                    "type": "init_pwm_motor",
                    "kind": "block"
                },
                {
                    "type": "set_pwm",
                    "kind": "block"
                }
            ]   
        },
        {
            "kind": "category",
            "name": "Sensors",
            "contents": [
                {
                    "type": "init_gyro",
                    "kind": "block"
                },
                {
                    "type": "get_gyro_angle",
                    "kind": "block"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Controllers",
            "contents": [
                {
                    "type": "get_raw_axis",
                    "kind": "block"
                },
                {
                    "type": "while_btn_held",
                    "kind": "block"
                },
                {
                    "type": "when_btn_pressed",
                    "kind": "block"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Commands",
            "contents": []
        }
    ]
}