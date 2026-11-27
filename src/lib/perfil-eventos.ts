// Aviso, dentro do navegador, de que o perfil do usuário mudou (foto ou nome).
// O cabeçalho fica montado o tempo todo (está no layout), então não percebe
// sozinho uma troca feita em /perfil/editar: quem altera dispara o evento e o
// cabeçalho busca os dados de novo.
export const PERFIL_ATUALIZADO = "bussola:perfil-atualizado";

export function avisarPerfilAtualizado() {
  window.dispatchEvent(new Event(PERFIL_ATUALIZADO));
}
