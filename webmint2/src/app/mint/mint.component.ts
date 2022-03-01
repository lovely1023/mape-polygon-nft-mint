import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MintComponent implements OnInit {
  ethWindow = window as any;
  metamaskInstalled = !!this.ethWindow.ethereum;
  userAddress: string = '';
  total: number = 1;

  constructor(private router: Router) {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (!isLoggedIn) this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.loginWithMetaMask();
  }

  mint() {
    alert('Minting...');
  }

  async loginWithMetaMask() {
    const accounts = await this.ethWindow.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((err: any) => console.error(err.message))
    if (!accounts) { return }

    this.ethWindow.userWalletAddress = this.userAddress = accounts[0];
  }

}
