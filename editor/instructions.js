function instructionsService() {
    var current = 0,
        instructions = [];

    return {
        add: function(newInstruction, index) {
            instructions.splice(index || instructions.length, 0, newInstruction);
        },
        remove: function(index) {
            instructions.splice(index || instructions.length, 1);
        },
        get: function(index) {
            current = index;
            return instructions[current];
        }
    }
}