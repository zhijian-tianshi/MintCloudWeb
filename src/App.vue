<template>
  <main class="app">
    <section class="hero">
      <p class="badge">MintCloud Web</p>
      <h1>个人前端开发使用</h1>
      <p class="summary">
        主要用于可视化 MQTT 消息、AI 能力、待办、博客自动更新发布等功能。
      </p>
    </section>
    <section class="cards">
      <article>
        <h2>可视化 MQTT 消息</h2>
        <p>聚合设备状态、实时消息流与监控数据。</p>
      </article>
      <article>
        <h2>AI 助手</h2>
        <p>覆盖生成、分析、自动化工作流，提升效率。</p>
      </article>
      <article>
        <h2>待办与博客</h2>
        <p>管理任务清单，并支持博客自动更新发布。</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #f6f7fb;
  color: #1f2328;
}

.app {
  min-height: 100vh;
  padding: 64px 24px;
  display: grid;
  gap: 48px;
  max-width: 1080px;
  margin: 0 auto;
}

.hero {
  display: grid;
  gap: 16px;
}

.badge {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 999px;
  background: #eef1ff;
  color: #3b5bfd;
  font-weight: 600;
  width: fit-content;
}

.summary {
  font-size: 18px;
  line-height: 1.7;
  color: #4b5563;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.cards article {
  background: #ffffff;
  padding: 20px 22px;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.cards h2 {
  margin: 0 0 10px;
  font-size: 18px;
}

.cards p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}
</style>
