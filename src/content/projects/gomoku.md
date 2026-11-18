---
title: C 语言五子棋
summary: 用 Win32 画的双人棋盘，纯 AI 作品。
category: 桌面游戏
stack: [C, Win32, GDI]
order: 2
visual: gomoku
cover:
  path: media/gomoku.webp
  alt: 五枚黑子在棋盘上斜向连成一线
sourceDownload: files/gomoku-source.zip
---

## 让鼠标落在交叉点上

棋盘用一个 15 × 15 的数组保存，屏幕上每两个相邻交叉点相隔 36 像素。程序先减去棋盘的起点坐标，再把点击位置换算成最近的行和列。点击已占用的交叉点会被忽略，回合保持不变。

## 为什么只检查最后一子？

一次落子只改变一个位置，新出现的连线一定经过这里。`has_five_from` 分别检查横、竖和两条斜线，每次从新棋子往两侧数连续的同色棋子，遇到空位、异色棋子或边界就停。

例如一条斜线上原本是两枚黑子、一个空位、两枚黑子。黑棋补在中间，把两侧的计数加上刚落下的一子，正好得到五。程序按五枚及以上判胜，因此一次落子连成更长的一排也能结束对局。

<details>
<summary>查看判胜函数 has_five_from</summary>

```c
static bool has_five_from(int row, int col) {
    const Stone stone = board[row][col];
    const int directions[4][2] = {
        { 0, 1 },
        { 1, 0 },
        { 1, 1 },
        { 1, -1 }
    };

    for (int i = 0; i < 4; i++) {
        int dr = directions[i][0];
        int dc = directions[i][1];
        int total = 1;
        total += count_in_direction(row, col, dr, dc, stone);
        total += count_in_direction(row, col, -dr, -dc, stone);

        if (total >= 5) {
            return true;
        }
    }

    return false;
}
```

</details>

## 一局棋怎么结束？

黑棋先手。每次落子都先判胜，再检查棋盘是否填满，两项都未触发时才交换回合。结果显示在棋盘下方，按 `R` 或 `F2` 即可清空棋盘，从黑棋重新开始。
