// Oculta navegação para gerente ao visualizar perfil de colaborador
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const colaborador = params.get('colaborador');
  let user = null;
  if (window.SwiftAuth && window.SwiftAuth.getCurrentUser) {
    user = window.SwiftAuth.getCurrentUser();
  } else {
    var userData = sessionStorage.getItem('swift_user') || localStorage.getItem('swift_user');
    if (userData) user = JSON.parse(userData);
  }
  if (colaborador && user && user.role === 'gerente') {
    var navLinks = document.querySelectorAll('a.nav-link');
    navLinks.forEach(function(link) {
      var txt = link.textContent.trim();
      if (txt === 'Ranking' || txt === 'Missões' || txt === 'Trilha de Aprendizagem') {
        link.style.display = 'none';
      }
    });
  }
});
// Exibe perfil de colaborador específico via ?colaborador=nome
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const colaborador = params.get('colaborador');
  if (colaborador && colaborador.toLowerCase() === 'lucas') {
    // Mock de dados do Lucas
    document.querySelectorAll('h1.h4, h1.h4.m-0').forEach(el => el.textContent = 'Lucas (Colaborador)');
    document.querySelectorAll('.badge-level').forEach(el => el.textContent = 'Ouro');
    document.querySelectorAll('.text-muted.small').forEach(el => {
      if (el.textContent.includes('Loja')) el.textContent = 'Loja Swift – Vila Mariana';
    });
    document.querySelectorAll('.progress-bar').forEach(el => el.style.width = '65%');
    document.querySelectorAll('.d-flex.justify-content-between.mt-1 small').forEach((el, i) => {
      if (i === 0) el.textContent = '1.280 pts';
      if (i === 1) el.textContent = 'Próximo: Diamante';
    });
    document.querySelectorAll('.ranking-badges').forEach(el => {
      el.innerHTML = '<span class="badge bg-light text-dark" title="Ranking local">1º local</span> <span class="badge bg-light text-dark" title="Ranking global">2º global</span>';
    });
    // Avatar
    document.querySelectorAll('.avatar-xl').forEach(el => {
      el.src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop';
      el.alt = 'Avatar do Colaborador';
    });
  }
});
window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});

// Esconder 'Área do Gerente' para usuários que não são gerente
window.addEventListener('DOMContentLoaded', () => {
  try {
    let user = null;
    if (window.SwiftAuth && window.SwiftAuth.getCurrentUser) {
      user = window.SwiftAuth.getCurrentUser();
    } else {
      const ud = sessionStorage.getItem('swift_user') || localStorage.getItem('swift_user');
      if (ud) user = JSON.parse(ud);
    }
    if (user && user.role !== 'gerente') {
      const managerLinks = Array.from(document.querySelectorAll('a.nav-link'))
        .filter(a => a.textContent && a.textContent.trim() === 'Área do Gerente');
      managerLinks.forEach(l => l.style.display = 'none');
    }
  } catch (e) { console.warn('Erro ao ocultar Área do Gerente:', e); }
});

function registrarVenda(){
  const valor = parseFloat(document.getElementById('valorVenda')?.value || '0');
  const codigo = (document.getElementById('codigoVendedor')?.value || '').trim();
  const cross = document.getElementById('crossSell')?.checked;
  if(!valor || !codigo){ alert('Preencha os campos.'); return; }
  const base = Math.round(valor / 10); // 1 ponto a cada R$10 (exemplo)
  const pontos = cross ? base * 2 : base;
  alert(`Venda registrada. Pontos: +${pontos}${cross ? ' (2× cross-sell)' : ''}`);
  const m = document.getElementById('registrarVendaModal');
  if (m) bootstrap.Modal.getInstance(m)?.hide();
}

function resolverDisputa(){
  const decisao = document.getElementById('decisaoDisputa')?.value;
  const codigo = (document.getElementById('codigoGerente')?.value || '').trim();
  if(!codigo){ alert('Informe o código de validação.'); return; }
  alert(`Disputa marcada como: ${decisao}. Código: ${codigo}`);
  const m = document.getElementById('resolverDisputaModal');
  if (m) bootstrap.Modal.getInstance(m)?.hide();
}
