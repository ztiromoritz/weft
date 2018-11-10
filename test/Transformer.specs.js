import { expect } from "chai"
import Transformer from '../src/app/js/utils/Transformer.js';

describe('Array', function() {
    describe('#parseCommands', function() {

        it('Empty string -> empty array', function(){
            // given
            const input = ``;

            // when
            const commands = Transformer.parseCommands(input);

            // then
            expect(commands).to.have.lengthOf(0);
        });

        it('Simple << >> tokens', function() {

            // given
            const input = `<< >> << >> <<>>`;

            // when
            const commands = Transformer.parseCommands(input);

            // then
            expect(commands).to.have.lengthOf(3);

        });

        it('Simple << >> tokens, including newline', function() {

            // given
            const input = `<< >> << >> <<>>
            <<>>`;

            // when
            const commands = Transformer.parseCommands(input);

            // then
            expect(commands).to.have.lengthOf(4);

        });


        it('Simple command <<:command "a" "b" "c">>', function(){
            // given
            const input = '<<:command "a" "b" "c">>';

            // when
            const commands = Transformer.parseCommands(input);

            expect(commands).to.have.lengthOf(1);
            expect(commands[0]).to.deep.equal({
                name : "command",
                args : ["a", "b", "c"]
            })
        });


        it('Message shortform <<moritz "hello">>  --> <<:msg "moritz" "hello">>', function(){
            // given
            const input = '<<moritz "hello">>';

            // when
            const commands = Transformer.parseCommands(input);

            expect(commands).to.have.lengthOf(1);
            expect(commands[0]).to.deep.equal({
                name : "msg",
                args : ["moritz", "hello" ]
            })
        });


    });
});
