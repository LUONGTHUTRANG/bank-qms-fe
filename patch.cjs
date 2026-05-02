
const fs = require('fs');

function patch(path, replacements) {
    let content = fs.readFileSync(path, 'utf8');
    replacements.forEach(([pattern, repl]) => {
        content = content.replace(pattern, repl);
    });
    fs.writeFileSync(path, content, 'utf8');
}

// QueueListSection
patch('src/features/counter/components/QueueListSection.tsx', [
    [/Cập nhật: 10:55:12/g, 'Cập nhật: --:--:--']
]);

// CurrentServingCard
patch('src/features/counter/components/CurrentServingCard.tsx', [
    [/>A105</g, '>---<'],
    [/>01:15</g, '>--:--<'],
    [/>00:03</g, '>--:--<'],
    [/>Giao dịch cá nhân</g, '>...<'],
    [/>Đang phục vụ • Counter 03</g, '>Đang phục vụ • Counter ...<']
]);

console.log('Patched');

