const bcrypt = require('bcryptjs');
async function test() {
    const hash = await bcrypt.hash('password123', 10);
    const isValid = await bcrypt.compare('password123', hash);
    console.log('bcrypt works:', isValid);
}
test();
