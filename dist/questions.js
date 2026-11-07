const fraction = (top, bottom) =>
  `<math aria-label="${top} over ${bottom}"><mfrac><mn>${top}</mn><mn>${bottom}</mn></mfrac></math>`;

const diagrams = {
  10: `<svg viewBox="0 0 232 132" role="img" aria-label="A chord CD is parallel to diameter AB and touches the cutout semicircle.">
    <path d="M16 112a100 100 0 0 1 200 0z" fill="#d7d7d7" stroke="#222"/>
    <path d="M56 112a60 60 0 0 1 120 0z" fill="white" stroke="#222"/>
    <path d="M36 52h160" stroke="#222"/>
    <g text-anchor="middle"><text x="15" y="127">A</text><text x="217" y="127">B</text>
      <text x="27" y="51">C</text><text x="205" y="51">D</text><text x="116" y="45">16</text></g>
  </svg>`,
  13: `<svg viewBox="0 0 162 162" role="img" aria-label="Concentric parallel squares with alternating shaded bands, starting at the outside.">
    ${Array.from({length: 15}, (_, index) => {
      const side = 142 * 0.70 ** index;
      const inset = (162 - side) / 2;
      return `<rect x="${inset}" y="${inset}" width="${side}" height="${side}" fill="${index % 2 ? "white" : "#bcbcbc"}" stroke="#333" stroke-width=".65"/>`;
    }).join("")}
  </svg>`,
  15: `<svg viewBox="0 0 242 163" role="img" aria-label="Rectangle ABEF with AD crossing BE at C. D is outside the rectangle and angle ADE is right.">
    <path d="M20 130H209V103H20zM20 130L101 22L209 103" fill="none" stroke="#222" stroke-width="1.4"/>
    <path d="M95.6 29.2l7.2 5.4 5.4-7.2" fill="none" stroke="#222"/>
    <g text-anchor="middle"><text x="12" y="144">A</text><text x="11" y="100">B</text>
      <text x="41" y="97">C</text><text x="101" y="17">D</text>
      <text x="218" y="101">E</text><text x="218" y="144">F</text></g>
  </svg>`,
  22: `<svg viewBox="0 -28 236 264" role="img" aria-label="Three externally tangent circles with radii 1, 2 and 3. A fourth circle fits in their central gap.">
    <g fill="white" stroke="#222" stroke-width="1.3">
      <circle cx="145" cy="145" r="84"/><circle cx="145" cy="33" r="28"/>
      <circle cx="61" cy="33" r="56"/>
    </g>
    <circle cx="119.43" cy="57.35" r="7.3" fill="#ddd" stroke="#222" stroke-width="1.2"/>
  </svg>`,
};

const QUESTIONS = [
  {
    en: "Two cyclists set off from the same spot in Mathville. Andy heads north at 8 miles per hour starting at 1:30. Betsy heads east at 12 miles per hour starting at 2:30. When will their distances from the starting spot be equal?",
    hk: "Andy 和 Betsy 從 Mathville 的同一地點騎單車出發。Andy 在 1:30 出發，以每小時 8 英里的速度向北行駛；Betsy 在 2:30 出發，以每小時 12 英里的速度向東行駛。他們在甚麼時候與出發點的距離相同？",
    cn: "Andy 和 Betsy 从 Mathville 的同一地点骑自行车出发。Andy 在 1:30 出发，以每小时 8 英里的速度向北行驶；Betsy 在 2:30 出发，以每小时 12 英里的速度向东行驶。他们在什么时候与出发点的距离相同？",
    choices: ["3:30", "3:45", "4:00", "4:15", "4:30"], answer: "E",
  },
  {
    en: "A 10-pound blend consists of 50% peanuts, 20% cashews and 30% almonds by weight. A second blend (20% peanuts, 40% cashews and 40% almonds) is poured in until peanuts account for 40% of the total weight. How many pounds of cashews does the combined blend contain?",
    hk: "10 磅混合果仁按重量計含有 50% 花生、20% 腰果和 30% 杏仁。加入另一種含有 20% 花生、40% 腰果和 40% 杏仁的混合果仁，直至花生佔總重量的 40%。混合後共有多少磅腰果？",
    cn: "10 磅混合坚果按重量计含有 50% 花生、20% 腰果和 30% 杏仁。加入另一种含有 20% 花生、40% 腰果和 40% 杏仁的混合坚果，直到花生占总重量的 40%。混合后共有多少磅腰果？",
    choices: ["3.5", "4", "4.5", "5", "6"], answer: "B",
  },
  {
    en: "Count the distinct side-length triples for nondegenerate isosceles triangles with integer sides and maximum side length 2025.",
    hk: "最長邊長為 2025，且三邊長均為整數的非退化等腰三角形，有多少組不同的邊長？",
    cn: "最长边长为 2025，且三边长均为整数的非退化等腰三角形，有多少组不同的边长？",
    choices: ["2025", "2026", "3012", "3037", "4050"], answer: "D",
  },
  {
    en: "There are 15 people split between a student team with mean age 12 and a teacher team with mean age 55. A newcomer would bring the student mean to 14 by joining that team, or the teacher mean to 52 by joining the other team. Find the newcomer's age.",
    hk: "學生隊和教師隊共有 15 人，平均年齡分別為 12 歲和 55 歲。一位新成員若加入學生隊，該隊平均年齡會變成 14 歲；若加入教師隊，該隊平均年齡會變成 52 歲。求這位新成員的年齡。",
    cn: "学生队和教师队共有 15 人，平均年龄分别为 12 岁和 55 岁。一位新成员若加入学生队，该队平均年龄会变成 14 岁；若加入教师队，该队平均年龄会变成 52 岁。求这位新成员的年龄。",
    choices: ["28", "29", "30", "32", "33"], answer: "A",
  },
  {
    en: "Starting at 1, count up to 2 and back down to 1, then up to 3 and back down to 1, and so on. Record each number as you reach it, so the list begins 1, 2, 1, 2, 3, 2, 1, 2, 3, 4, 3, 2, 1, … . Which number is in position 2025?",
    hk: "由 1 數到 2，再倒數到 1，接着數到 3 並倒數到 1，如此類推。每到一個數便記下，得到數列 1，2，1，2，3，2，1，2，3，4，3，2，1，……。第 2025 項是甚麼？",
    cn: "从 1 数到 2，再倒数到 1，接着数到 3 并倒数到 1，以此类推。每到一个数便记下，得到数列 1，2，1，2，3，2，1，2，3，4，3，2，1，……。第 2025 项是什么？",
    choices: ["5", "15", "16", "44", "45"], answer: "E",
  },
  {
    en: "Split each corner of an equilateral triangle into three equal angles using two rays. The region common to all three middle wedges forms a convex hexagon. Find the measure in degrees of its least interior angle.",
    hk: "在等邊三角形的每個頂點畫兩條射線，將該頂角三等分。三個中間角的公共區域形成凸六邊形。求此六邊形最小內角的度數。",
    cn: "在等边三角形的每个顶点画两条射线，将该顶角三等分。三个中间角的公共区域形成凸六边形。求此六边形最小内角的度数。",
    choices: ["80", "90", "100", "110", "120"], answer: "C",
  },
  {
    en: "For real <i>a</i> and <i>b</i>, dividing <span class=\"math\">x³ + x² + ax + b</span> by <span class=\"math\">x − 1</span> gives remainder 4, while division by <span class=\"math\">x − 2</span> gives remainder 6. Compute <span class=\"math\">b − a</span>.",
    hk: "設 <i>a</i> 和 <i>b</i> 為實數。多項式 <span class=\"math\">x³ + x² + ax + b</span> 除以 <span class=\"math\">x − 1</span> 的餘數為 4，除以 <span class=\"math\">x − 2</span> 的餘數為 6。求 <span class=\"math\">b − a</span>。",
    cn: "设 <i>a</i> 和 <i>b</i> 为实数。多项式 <span class=\"math\">x³ + x² + ax + b</span> 除以 <span class=\"math\">x − 1</span> 的余数为 4，除以 <span class=\"math\">x − 2</span> 的余数为 6。求 <span class=\"math\">b − a</span>。",
    choices: ["14", "15", "16", "17", "18"], answer: "E",
  },
  {
    en: "Consider four claims about the same list of four claims:<ul><li>The list contains a true claim.</li><li>Two or more claims are true.</li><li>Two or more claims are false.</li><li>The list contains a false claim.</li></ul>If each claim is either true or false, how many are false?",
    hk: "以下四句話都在描述這四句話本身：<ul><li>其中至少有一句是真的。</li><li>其中至少有兩句是真的。</li><li>其中至少有兩句是假的。</li><li>其中至少有一句是假的。</li></ul>若每句話非真即假，有多少句是假的？",
    cn: "以下四句话都在描述这四句话本身：<ul><li>其中至少有一句是真的。</li><li>其中至少有两句是真的。</li><li>其中至少有两句是假的。</li><li>其中至少有一句是假的。</li></ul>若每句话非真即假，有多少句是假的？",
    choices: ["0", "1", "2", "3", "4"], answer: "B",
  },
  {
    en: "Let <span class=\"math\">f(x) = 100x³ − 300x² + 200x</span>. Count the horizontal shifts <i>a</i> for which the curve <span class=\"math\">y = f(x − a)</span> contains <span class=\"math\">(1, 25)</span>.",
    hk: "設 <span class=\"math\">f(x) = 100x³ − 300x² + 200x</span>。有多少個實數 <i>a</i> 使曲線 <span class=\"math\">y = f(x − a)</span> 通過 <span class=\"math\">(1, 25)</span>？",
    cn: "设 <span class=\"math\">f(x) = 100x³ − 300x² + 200x</span>。有多少个实数 <i>a</i> 使曲线 <span class=\"math\">y = f(x − a)</span> 经过 <span class=\"math\">(1, 25)</span>？",
    choices: ["1", "2", "3", "4", {en: "More than 4", hk: "多於 4", cn: "多于 4"}], answer: "C",
  },
  {
    en: "In a semicircle with diameter <i>AB</i>, the chord <i>CD</i> is parallel to <i>AB</i> and measures 16. Remove the smaller semicircle whose diameter lies along <i>AB</i> and whose arc touches <i>CD</i> as shown. Find the shaded area.",
    hk: "在以 <i>AB</i> 為直徑的半圓內，弦 <i>CD</i> 平行於 <i>AB</i>，長度為 16。如圖挖去一個小半圓，其直徑在 <i>AB</i> 上，圓弧與 <i>CD</i> 相切。求陰影面積。",
    cn: "在以 <i>AB</i> 为直径的半圆内，弦 <i>CD</i> 平行于 <i>AB</i>，长度为 16。如图挖去一个小半圆，其直径在 <i>AB</i> 上，圆弧与 <i>CD</i> 相切。求阴影面积。",
    choices: ["16π", "24π", "32π", "48π", "64π"], answer: "C",
  },
  {
    en: "Two strictly increasing four-term integer sequences begin at 1 and end at <i>z</i>. The arithmetic sequence has middle terms <i>x</i>, <i>y</i> and the geometric sequence has middle terms <i>p</i>, <i>q</i>. For the least possible <i>z</i>, find <span class=\"math\">x + y + z + p + q</span>.",
    hk: "兩個嚴格遞增的四項整數數列均以 1 開始、以 <i>z</i> 結束。等差數列的中間兩項為 <i>x</i>、<i>y</i>，等比數列的中間兩項為 <i>p</i>、<i>q</i>。取最小可能的 <i>z</i>，求 <span class=\"math\">x + y + z + p + q</span>。",
    cn: "两个严格递增的四项整数数列均以 1 开始、以 <i>z</i> 结束。等差数列的中间两项为 <i>x</i>、<i>y</i>，等比数列的中间两项为 <i>p</i>、<i>q</i>。取最小可能的 <i>z</i>，求 <span class=\"math\">x + y + z + p + q</span>。",
    choices: ["66", "91", "103", "132", "149"], answer: "E",
  },
  {
    en: "A four-digit lock code uses digits from 1 through 9. It has exactly one even digit and exactly one prime digit. The same position can satisfy both conditions. How many codes are possible?",
    hk: "一個四位密碼只使用 1 至 9 的數字，恰有一個數字是偶數，也恰有一個數字是質數。同一位置可以同時符合這兩個條件。共有多少個這樣的密碼？",
    cn: "一个四位密码只使用 1 至 9 的数字，恰有一个数字是偶数，也恰有一个数字是质数。同一位置可以同时符合这两个条件。共有多少个这样的密码？",
    choices: ["176", "192", "432", "464", "608"], answer: "D",
  },
  {
    en: "An infinite family of concentric squares has parallel sides. Moving inward, each new side length is <i>k</i> times the preceding one, with <span class=\"math\">0 &lt; k &lt; 1</span>. Shade every other band, beginning with the outside band. If the shaded area is 64% of the largest square's area, find <i>k</i>.",
    hk: "無限多個同心正方形的對應邊互相平行。從外向內，每個正方形的邊長都是前一個的 <i>k</i> 倍，其中 <span class=\"math\">0 &lt; k &lt; 1</span>。由最外一圈開始，每隔一圈塗上陰影。若陰影佔最大正方形面積的 64%，求 <i>k</i>。",
    cn: "无穷多个同心正方形的对应边互相平行。从外向内，每个正方形的边长都是前一个的 <i>k</i> 倍，其中 <span class=\"math\">0 &lt; k &lt; 1</span>。从最外一圈开始，每隔一圈涂上阴影。若阴影占最大正方形面积的 64%，求 <i>k</i>。",
    choices: [fraction(3, 5), fraction(16, 25), fraction(2, 3), fraction(3, 4), fraction(4, 5)], answer: "D",
  },
  {
    en: "Two students and two teachers are assigned distinct seats uniformly at random from six chairs around a round table. What is the chance that the students sit next to one another and the teachers also sit next to one another?",
    hk: "一張圓桌周圍有六張椅子。兩名學生和兩名教師各隨機坐在不同的椅子上。兩名學生相鄰、同時兩名教師也相鄰的概率是多少？",
    cn: "一张圆桌周围有六把椅子。两名学生和两名教师各随机坐在不同的椅子上。两名学生相邻、同时两名教师也相邻的概率是多少？",
    choices: [fraction(1, 6), fraction(1, 5), fraction(2, 9), fraction(3, 13), fraction(1, 4)], answer: "B",
  },
  {
    en: "In rectangle <i>ABEF</i>, <span class=\"math\">AF = 7</span> and <span class=\"math\">AB = 1</span>. The segment <i>AD</i> has length 5 and crosses <i>BE</i> at <i>C</i>. The angle <i>ADE</i> is right. What is the area of triangle <i>ABC</i>?",
    hk: "在長方形 <i>ABEF</i> 中，<span class=\"math\">AF = 7</span>，<span class=\"math\">AB = 1</span>。長度為 5 的線段 <i>AD</i> 在 <i>C</i> 點與 <i>BE</i> 相交，且 <i>ADE</i> 為直角。求三角形 <i>ABC</i> 的面積。",
    cn: "在矩形 <i>ABEF</i> 中，<span class=\"math\">AF = 7</span>，<span class=\"math\">AB = 1</span>。长度为 5 的线段 <i>AD</i> 在 <i>C</i> 点与 <i>BE</i> 相交，且 <i>ADE</i> 为直角。求三角形 <i>ABC</i> 的面积。",
    choices: [fraction(3, 8), fraction(4, 9), fraction(1, 8) + "√13", fraction(7, 15), fraction(1, 8) + "√15"], answer: "A",
  },
  {
    en: "Independently for each of three coins, choose one of three jars uniformly and put the coin in it. Take the largest of the three jar counts. What is the expected value of that count?",
    hk: "將三枚硬幣分別放入三個罐子。每枚硬幣均獨立、等概率地選擇一個罐子。三個罐子的硬幣數量中，最大值的期望是多少？",
    cn: "将三枚硬币分别放入三个罐子。每枚硬币均独立、等概率地选择一个罐子。三个罐子的硬币数量中，最大值的期望是多少？",
    choices: [fraction(4, 3), fraction(13, 9), fraction(5, 3), fraction(17, 9), "2"], answer: "D",
  },
  {
    en: "The same positive integer <i>N</i> gives remainder 16 when dividing 273,436 and remainder 15 when dividing 272,760. What digit is in the tens place of <i>N</i>?",
    hk: "用同一個正整數 <i>N</i> 分別除 273,436 和 272,760，所得餘數分別為 16 和 15。<i>N</i> 的十位數字是甚麼？",
    cn: "用同一个正整数 <i>N</i> 分别除 273,436 和 272,760，所得余数分别为 16 和 15。<i>N</i> 的十位数字是什么？",
    choices: ["0", "1", "2", "3", "4"], answer: "E",
  },
  {
    en: "To calculate a harmonic mean, average the reciprocals and then take the reciprocal of the result. Find the harmonic mean of the real zeros of the polynomial below.",
    equation: "<math display=\"block\"><munderover><mo>∏</mo><mrow><mi>k</mi><mo>=</mo><mn>1</mn></mrow><mn>2025</mn></munderover><mrow><mo>(</mo><mi>k</mi><msup><mi>x</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>x</mi><mo>−</mo><mn>3</mn><mo>)</mo></mrow></math>",
    hk: "計算調和平均數時，先求各數倒數的算術平均數，再取其倒數。求下列多項式所有實根的調和平均數。",
    cn: "计算调和平均数时，先求各数倒数的算术平均数，再取其倒数。求下列多项式所有实根的调和平均数。",
    choices: [fraction("−5", 3), fraction("−3", 2), fraction("−6", 5), fraction("−5", 6), fraction("−2", 3)], answer: "B",
  },
  {
    en: "Start a triangular array with the row −1, 3, 1. For each new row, put the sums of consecutive pairs from the previous row between a leading −1 and a trailing 1. The next two rows are −1, 2, 4, 1 and −1, 1, 6, 5, 1. In the row whose entries total 12,288, what is the third entry from the left?",
    hk: "數陣首列為 −1、3、1。每個新列以 −1 開頭、以 1 結尾，中間依次填入上一列各對相鄰數之和。接下來兩列是 −1、2、4、1 和 −1、1、6、5、1。當某列的總和為 12,288 時，該列由左至右第三個數是多少？",
    cn: "数阵首行为 −1、3、1。每个新行以 −1 开头、以 1 结尾，中间依次填入上一行各对相邻数之和。接下来两行是 −1、2、4、1 和 −1、1、6、5、1。当某行的总和为 12,288 时，该行从左到右第三个数是多少？",
    choices: ["−29", "−21", "−14", "−8", "−3"], answer: "A",
  },
  {
    en: "From above, a silo is a circle of diameter 20 meters. Relative to its center, one observer stands 20 meters west and 15 meters south. Another stands 20 meters east and <i>g</i> meters south, with <span class=\"math\">g &gt; 0</span>. Their line of sight is tangent to the circle. Write <span class=\"math\">g = (a√b − c)/d</span> with positive integers, squarefree <i>b</i> and <span class=\"math\">gcd(a, c, d) = 1</span>. Find <span class=\"math\">a + b + c + d</span>.",
    hk: "俯視一個直徑為 20 米的圓形筒倉。甲在圓心以西 20 米、以南 15 米；乙在圓心以東 20 米、以南 <i>g</i> 米，其中 <span class=\"math\">g &gt; 0</span>。兩人的連線與圓相切。將 <i>g</i> 寫成 <span class=\"math\">(a√b − c)/d</span>，各字母代表正整數，<i>b</i> 不含平方因子，且 <span class=\"math\">gcd(a, c, d) = 1</span>。求 <span class=\"math\">a + b + c + d</span>。",
    cn: "俯视一个直径为 20 米的圆形筒仓。甲在圆心以西 20 米、以南 15 米；乙在圆心以东 20 米、以南 <i>g</i> 米，其中 <span class=\"math\">g &gt; 0</span>。两人的连线与圆相切。将 <i>g</i> 写成 <span class=\"math\">(a√b − c)/d</span>，各字母代表正整数，<i>b</i> 不含平方因子，且 <span class=\"math\">gcd(a, c, d) = 1</span>。求 <span class=\"math\">a + b + c + d</span>。",
    choices: ["119", "120", "121", "122", "123"], answer: "A",
  },
  {
    en: "Choose as many numbers as possible from the integers 1 through 20, subject to the rule that the sum of any two chosen numbers must be absent from the selection. The two numbers being added may be the same. What is the largest possible selection size?",
    hk: "從 1 至 20 的整數中盡可能多選一些數，要求任意兩個所選數的和都不在所選數之中。相加的兩個數可以相同。最多可以選多少個數？",
    cn: "从 1 至 20 的整数中尽可能多选一些数，要求任意两个所选数的和都不在所选数之中。相加的两个数可以相同。最多可以选多少个数？",
    choices: ["8", "9", "10", "11", "12"], answer: "C",
  },
  {
    en: "Three circles of radii 1, 2 and 3 touch one another externally. A fourth circle, of radius <i>r</i>, fits in the gap between them and is externally tangent to each. Find <i>r</i>.",
    hk: "半徑為 1、2、3 的三個圓兩兩外切。半徑為 <i>r</i> 的第四個圓位於三圓之間的空隙，並與三圓分別外切。求 <i>r</i>。",
    cn: "半径为 1、2、3 的三个圆两两外切。半径为 <i>r</i> 的第四个圆位于三圆之间的空隙，并与三圆分别外切。求 <i>r</i>。",
    choices: [fraction(1, 4), fraction(6, 23), fraction(3, 11), fraction(5, 17), fraction(3, 10)], answer: "B",
  },
  {
    en: "In triangle <i>ABC</i>, the lengths of <i>AB</i>, <i>BC</i> and <i>AC</i> are 80, 45 and 75, respectively. Let <i>P</i> be where the perpendicular from <i>C</i> to <i>AB</i> meets the internal bisector at <i>B</i>. Find <i>BP</i>.",
    hk: "在三角形 <i>ABC</i> 中，<i>AB</i>、<i>BC</i> 和 <i>AC</i> 的長度分別為 80、45 和 75。從 <i>C</i> 向 <i>AB</i> 作垂線，與 <i>B</i> 的內角平分線交於 <i>P</i>。求 <i>BP</i>。",
    cn: "在三角形 <i>ABC</i> 中，<i>AB</i>、<i>BC</i> 和 <i>AC</i> 的长度分别为 80、45 和 75。从 <i>C</i> 向 <i>AB</i> 作垂线，与 <i>B</i> 的内角平分线交于 <i>P</i>。求 <i>BP</i>。",
    choices: ["18", "19", "20", "21", "22"], answer: "D",
  },
  {
    en: "Form a positive integer using distinct nonzero digits. A digit with neighbors on both sides cannot be smaller than both neighbors. How many integers can be formed under this rule?",
    hk: "用互不相同的非零數字組成一個正整數。任何左右均有相鄰數字的位置，其數字不可同時小於左右兩個數字。符合條件的正整數有多少個？",
    cn: "用互不相同的非零数字组成一个正整数。任何左右均有相邻数字的位置，其数字不可同时小于左右两个数字。符合条件的正整数有多少个？",
    choices: ["511", "2584", "9841", "17711", "19682"], answer: "C",
  },
  {
    en: "Sample a point <i>P</i> uniformly from the interior of square <i>ABCD</i>. The chance that <i>AP</i> is the middle-length side of triangle <i>APB</i> is <span class=\"math\">(a + bπ − c√d)/e</span>, with positive integers, squarefree <i>d</i> and <span class=\"math\">gcd(a, b, c, e) = 1</span>. Compute <span class=\"math\">a + b + c + d + e</span>.",
    hk: "在正方形 <i>ABCD</i> 內均勻隨機選取一點 <i>P</i>。在三角形 <i>APB</i> 中，<i>AP</i> 是長度居中的邊的概率為 <span class=\"math\">(a + bπ − c√d)/e</span>，各字母代表正整數，<i>d</i> 不含平方因子，且 <span class=\"math\">gcd(a, b, c, e) = 1</span>。求 <span class=\"math\">a + b + c + d + e</span>。",
    cn: "在正方形 <i>ABCD</i> 内均匀随机选取一点 <i>P</i>。在三角形 <i>APB</i> 中，<i>AP</i> 是长度居中的边的概率为 <span class=\"math\">(a + bπ − c√d)/e</span>，各字母代表正整数，<i>d</i> 不含平方因子，且 <span class=\"math\">gcd(a, b, c, e) = 1</span>。求 <span class=\"math\">a + b + c + d + e</span>。",
    choices: ["25", "26", "27", "28", "29"], answer: "A",
  },
];
