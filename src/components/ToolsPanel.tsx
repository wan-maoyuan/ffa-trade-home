import React, { useState } from 'react';
import './CoursePanel.css';
import SideMenu from './SideMenu';

// 轮播图片、折线图等地址，可根据实际换成最新的 Figma 图
const carouselImgs = [
  "https://www.figma.com/api/mcp/asset/abf267a5-ee09-4996-873e-b15fed288b23",
  "https://www.figma.com/api/mcp/asset/c46638c6-ec1d-4c21-9b93-cf07b86b0b02",
  "https://www.figma.com/api/mcp/asset/6fc68433-14db-4f0b-a4d8-715c81a63e2b",
  "https://www.figma.com/api/mcp/asset/2e2eeb19-42c9-4c69-b40e-401faabf3776",
  "https://www.figma.com/api/mcp/asset/c07f1489-a990-4732-9b2a-bc65ea927eb8"
];
const lineChartImg = "https://www.figma.com/api/mcp/asset/131840e1-99b0-49cb-96f9-9ae146eb5066";

const carouselContent = [
  {title:'运费转换工具', desc:'程租、期租智能一键切换，报表自动核算。', btn:'立即体验'},
  {title:'船-航线精准匹配', desc:'基于船舶参数、航线特征一站智能推荐。', btn:'匹配查询'},
  {title:'头寸风控管理', desc:'现货、衍生头寸归集，一览无余。', btn:'风险评估'},
  {title:'数据集成优化', desc:'燃油/港杂/气象回测，收益自动归集分析。', btn:'数据洞察'},
  {title:'船队决策支持', desc:'自动评估收益风险，优化配置与套利推荐。', btn:'科学决策'}
];

const ToolsPanel: React.FC = () => {
  const [cur, setCur] = useState(0);
  return (
    <div style={{position:'relative', background:'#f3f7ff', minHeight:'900px', width:'100%', overflow:'hidden'}}>
      <SideMenu currentPage="tool" />
      {/* 顶部导航预留 */}
      <div style={{height:72}}></div>
      {/* 横向排列大区块 */}
      <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', width:'100%', height:'640px', marginTop:28}}>
        {/* 左侧轮播图卡片区 */}
        <div style={{width:794, height:386, background:'#fff', borderRadius:15, overflow:'hidden', boxShadow:'0 6px 38px 0 rgba(46,86,163,0.10)', position:'relative', display:'flex',alignItems:'center',marginRight:44}}>
          <img src={carouselImgs[cur]} alt='轮播' style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:15}}/>
          <div style={{position:'absolute', bottom:18, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, zIndex:2}}>
            {carouselImgs.map((img, idx) => (
              <span
                key={idx}
                onClick={()=>setCur(idx)}
                style={{display:'inline-block', width:13.5, height:13.5,background: idx===cur ? '#2e56a3' : '#dddddd',borderRadius:'50%', cursor:'pointer', border:'2px solid #f3f7ff', transition:'all 0.2s'}}
              />
            ))}
          </div>
        </div>
        {/* 右区文字说明与按钮区域 */}
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'flex-start', height:386,paddingLeft:10, width:500, position:'relative'}}>
          <h1 style={{fontWeight:700, fontSize:48, color:'#2e56a3',margin:0,letterSpacing:1}}>AQUABRIDGE</h1>
          <p style={{color:'#212a37', fontWeight:700,fontSize:20,margin:'13px 0 6px 0'}}>一站式衍生品综合服务商</p>
          <p style={{color:'#2e56a3', margin:0,fontSize:15,marginBottom:13}}>One-stop derivatives integrated service provider</p>
          <img src={lineChartImg} alt='折线' style={{width:430,margin:'15px 0 9px -3px',height:62,objectFit:'contain'}}/>
          <div style={{color:'#212a37',fontSize:14,lineHeight:'22px',marginTop:10,maxWidth:465,opacity:0.98}}>
            本工具专为航运从业者打造，提供程租/期租智能转换、船-航线精准匹配及头寸风控管理一站式解决方案。通过实时整合燃油价格、港口费用、船舶性能等数据，实现租船模式灵活转换；基于船舶参数、航线特征与货盘需求智能推荐最优配对；同时归集现货与衍生品头寸，助力用户快速评估业务收益与风险、优化船队部署并捕捉市场套利机会，实现科学决策与运营增效。
          </div>
          <button style={{position:'absolute', bottom:0, left:0, width:96, height:39, background:'#2e56a3', color:'#fff', fontSize:16, border:'none', borderRadius:12, fontWeight:700, boxShadow:'0 2px 18px 0 rgba(46,86,163,0.15)', cursor:'pointer', letterSpacing:2,marginTop:18}}>工具入口</button>
        </div>
      </div>
    </div>
  );
}

export default ToolsPanel;
