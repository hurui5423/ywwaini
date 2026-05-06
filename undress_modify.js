// 文件名: undress_modify.js
// 功能: 修改 undress.app 用户信息
// 触发URL: ^https:\/\/api\.undress\.app\/user\/info
// 更新时间: 2026-05-06
// 使用说明: 将此脚本放入 Quantumult X/Scripts 目录，并在重写规则中引用

// ============ 配置区域 ============
const CONFIG = {
  enabled: true,           // 总开关
  debug: true,            // 调试模式（建议开启）
  
// 修改数值配置
 "total" : 99999,            // 积分总数
 "available" : 99999,    // 获得使用
 "frozen": 0                   // 冻结
 "credits":  9999,        // 学分
 "referals": 2                //參考
 "Expires": "2099-12-31T23:59:59Z",  //
 參考过期时间
"remaining_monthly_refunds": 1000       // 每月剩余退款
};

// ============ 主处理函数 ============
(function() {
  'use strict';
  
  // 检查响应
  if (!$response || $response.status !== 200) {
    console.log(`[undress_modify] 响应无效: status=${$response?.status}`);
    $done({});
    return;
  }
  
  console.log(`[undress_modify] 开始处理: ${$request.url}`);
  
  try {
    // 获取响应体和编码信息
    let body = $response.body;
    const encoding = $response.headers['Content-Encoding'];
    
    console.log(`[undress_modify] 原始编码: ${encoding}`);
    console.log(`[undress_modify] 原始大小: ${body.length} bytes`);
    
    // 处理 Brotli 压缩
    if (encoding === 'br') {
      if (typeof $brotli !== 'undefined') {
        try {
          body = $brotli.decode(body);
          console.log(`[undress_modify] Brotli 解压成功`);
        } catch (e) {
          console.log(`[undress_modify] Brotli 解压失败: ${e.message}`);
        }
      } else {
        console.log(`[undress_modify] 警告: $brotli 对象未定义，无法解压`);
      }
    }
    
    // 解析JSON数据
    let data;
    if (typeof body === 'string') {
      data = JSON.parse(body);
    } else if (body instanceof ArrayBuffer) {
      data = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(body)));
    } else {
      console.log(`[undress_modify] 响应体格式不支持`);
      $done({});
      return;
    }
    
    // 记录原始值
    const originalCredits = data.credits || 0;
    const originalVip = data.is_vip || data.vip || false;
        console.log(`[undress_modify] 原始数据预览:`, JSON.stringify(data).substring(0, 300));
    console.log(`[undress_modify] 原始积分: ${originalCredits}, 原始VIP: ${originalVip}`);
    
    // ============ 开始修改数据 ============
    if (CONFIG.enabled) {
      // 1. 修改积分
      if (data.credits !== undefined) {
        data.credits = CONFIG.credits;
        console.log(`[undress_modify] 积分修改: ${originalCredits} → ${CONFIG.credits}`);
      }
      
      // 2. 修改积分明细
      if (data.credits_breakdown) {
        data.credits_breakdown.available = CONFIG.credits;
        data.credits_breakdown.total = CONFIG.credits;
        console.log(`[undress_modify] 积分明细已更新`);
      }
      
      // 3. 设置VIP信息
      data.is_vip = true;
      data.vip = true;
      data.vip_level = CONFIG.vipLevel;
      data.premium = true;
      data.vip_expires = CONFIG.vipExpires;
      console.log(`[undress_modify] VIP等级设置为: ${CONFIG.vipLevel}`);
      
      // 4. 设置其他资源
      data.energy = CONFIG.energy;
      data.daily_limit = CONFIG.dailyLimit;
      data.unlimited_access = true;
      data.all_features_unlocked = true;
      
      // 5. 添加修改标记（仅供调试）
      data._modified = {
        timestamp: new Date().toISOString(),
        script: "undress_modify.js",
        original_credits: originalCredits
      };
      
      // 6. 添加功能解锁标记
      data.features = {
        unlimited_generations: true,
        hd_quality: true,
        fast_processing: true,
        no_watermark: true,
        all_styles: true,
        commercial_use: true
      };
    }
    
    // 转换回字符串
    let newBody = JSON.stringify(data, null, 2);
    console.log(`[undress_modify] 修改后大小: ${newBody.length} chars`);
    
    // 重新压缩（如果需要）
    if (encoding === 'br' && typeof $brotli !== 'undefined') {
      try {
        newBody = $brotli.encode(newBody);
        console.log(`[undress_modify] Brotli 重新压缩成功`);
      } catch (e) {
        console.log(`[undress_modify] Brotli 压缩失败: ${e.message}`);
      }
    }
    
    console.log(`[undress_modify] 脚本执行完成 ✓`);
    $done({body: newBody});
    
  } catch (error) {
    console.log(`[undress_modify] 脚本执行出错: ${error}`);
    console.log(`[undress_modify] 错误堆栈: ${error.stack}`);
    $done({});
  }
})();

</textarea></code></pre>