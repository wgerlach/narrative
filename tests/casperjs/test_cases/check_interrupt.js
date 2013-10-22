//
// Test kernel interrupt 
//
casper.notebook_test(function () {

    this.echo('Running sleep in code cell');
    this.evaluate(function () {
        var cell = IPython.notebook.get_cell(0);
        cell.set_text('import time\nfor x in range(3):\n    time.sleep(1)');
        cell.execute();
    });


    this.echo('Trying to click the kernel interrupt button');
    // interrupt using menu item (Kernel -> Interrupt)
    this.thenClick('li#int_kernel');

    this.echo('Waiting for output');
    this.wait_for_output(0);

    this.then(function () {
        var result = this.get_output_cell(0);
        this.test.assertEquals(result.ename, 'KeyboardInterrupt', 'keyboard interrupt (mouseclick)');
    });

    this.test.done();
    /* The keyboard codes seem to be broken 
    this.echo('Re-running sleep in code cell');
    // run cell 0 again, now interrupting using keyboard shortcut
    this.thenEvaluate(function () {
        cell.clear_output();
        cell.execute();
    });

    this.echo('Trying to interrupt using Ctrl-M I');
    // interrupt using Ctrl-M I keyboard shortcut
    this.thenEvaluate( function() {
        IPython.utils.press_ghetto(IPython.utils.keycodes.I)
    });
    
    this.echo('Waiting for output');
    this.wait_for_output(0);
    
    this.then(function () {
        var result = this.get_output_cell(0);
        this.test.assertEquals(result.ename, 'KeyboardInterrupt', 'keyboard interrupt (shortcut)');
    });
    */
});
